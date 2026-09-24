// One-off: fills missing translations for every project, feature and category.
// Only fields that are still missing are sent, and existing non-blank
// translations (hand fixes included) are never overwritten, so a re-run after
// an interruption is safe and costs nothing for rows already done.
// Run: node --experimental-strip-types --env-file=.env.local scripts/translate-backfill.ts
import { neon } from "@neondatabase/serverless";
import { TARGETS } from "../lib/i18n-config.ts";
import {
	type FieldTranslations,
	PROJECT_FIELDS,
	mergeTranslations,
	missingFields,
	translateTexts,
} from "../lib/translate.ts";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const sql = neon(process.env.DATABASE_URL);

type Row = Record<string, any>;
type Job = {
	label: string;
	row: Row;
	todo: string[];
	fresh: FieldTranslations<string>;
	left: number; // texts still waiting for a translation
	save: (id: number, translations: string) => Promise<unknown>;
};

const jobs: Job[] = [];
const plan = (
	rows: Row[],
	fields: readonly string[],
	save: Job["save"],
	label: string,
) => {
	for (const row of rows) {
		// A blank Catalan field has nothing to translate (the site falls back to
		// Catalan), so it is skipped; otherwise it would count as work forever.
		const todo = missingFields(row.translations, fields).filter((f) => row[f]?.trim());
		if (todo.length) jobs.push({ label, row, todo, fresh: {}, left: todo.length, save });
	}
};

plan(
	await sql`SELECT id, title, description, full_description, duration, translations FROM project ORDER BY id`,
	PROJECT_FIELDS,
	(id, t) => sql`UPDATE project SET translations = ${t}::jsonb WHERE id = ${id}`,
	"project",
);
plan(
	await sql`SELECT id, description, translations FROM feature ORDER BY id`,
	["description"],
	(id, t) => sql`UPDATE feature SET translations = ${t}::jsonb WHERE id = ${id}`,
	"feature",
);
plan(
	await sql`SELECT id, name, translations FROM category ORDER BY id`,
	["name"],
	(id, t) => sql`UPDATE category SET translations = ${t}::jsonb WHERE id = ${id}`,
	"category",
);

// Every text to send, packed across rows into requests of at most 1,000
// source characters (a longer single text goes alone): Azure F0 throttles
// bursts, and a ~78k-character burst has already tripped 429001.
type Unit = { job: Job; field: string; text: string };
const batches: Unit[][] = [];
let batch: Unit[] = [];
let size = 0;
for (const job of jobs) {
	for (const field of job.todo) {
		const text: string = job.row[field];
		if (batch.length && (batch.length === 100 || size + text.length > 1000)) {
			batches.push(batch);
			batch = [];
			size = 0;
		}
		batch.push({ job, field, text });
		size += text.length;
	}
}
if (batch.length) batches.push(batch);

const host = new URL(process.env.DATABASE_URL).hostname;
const chars = batches.flat().reduce((n, u) => n + u.text.length, 0);
console.log(`target database: ${host.slice(0, 12)}…`);
console.log(
	`planned: ${jobs.length} rows, ${chars} characters in ${batches.length} requests (~${Math.max(0, batches.length - 1) * 10}s of pauses)`,
);

let saved = 0;
for (let i = 0; i < batches.length; i++) {
	if (i > 0) {
		// Same spacing as scripts/translate-messages.ts: keeps the billed
		// characters per minute well under the F0 sliding-window limit.
		await new Promise((r) => setTimeout(r, 10_000));
	}
	const result = await translateTexts(batches[i].map((u) => u.text));
	if (!result) {
		// No retry loop: a failure here is almost always the rate limit (429),
		// the monthly quota (403) or an outage, and more requests won't help.
		// Rows not yet saved stay exactly as they were.
		console.error(
			`Azure Translator failed on request ${i + 1}/${batches.length} (status above: 429 = rate limit, 403 = monthly quota).\n` +
				`${saved} rows saved, ${jobs.length - saved} rows left untouched. Wait a few minutes and re-run; saved rows are skipped.`,
		);
		process.exit(1);
	}
	for (const [n, { job, field }] of batches[i].entries()) {
		for (const t of TARGETS) (job.fresh[t] ??= {})[field] = result[t][n];
		if (--job.left) continue;
		// Every field is `pending` (none changed): fresh text only fills
		// languages where the stored translation is missing or blank.
		const merged = mergeTranslations(job.row.translations, job.fresh, [], job.todo);
		await job.save(job.row.id, JSON.stringify(merged));
		saved++;
		console.log(`${job.label} ${job.row.id}: ${job.todo.join(", ")}`);
	}
}
console.log(`backfill done: ${saved} rows saved`);
