// One-off: fills missing translations for every project, feature and category.
// Only fields that are still missing are sent, and existing non-blank
// translations (hand fixes included) are never overwritten, so a re-run after
// an interruption is safe and costs nothing for rows already done.
// Dry run by default: prints the target host and the planned work, then exits
// without calling Azure or writing. Pass --write to translate and save.
// Run: node --experimental-strip-types --env-file=.env.local scripts/translate-backfill.ts [--write]
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
const write = process.argv.includes("--write");
// Test-only: waits this long before each save, so a row can be edited
// mid-run to exercise the compare-and-set below.
const pauseBeforeSave = Number(process.env.BACKFILL_TEST_PAUSE_MS) || 0;

type Translations = FieldTranslations<string> | null;
type Row = { id: number; translations: Translations; [column: string]: unknown };
// Compare-and-set: saves only if neither the translations nor the Catalan
// source columns changed since they were read; resolves to the updated rows.
type Save = (row: Row, translations: string) => Promise<unknown[]>;
type Job = {
	label: string;
	row: Row;
	todo: string[];
	fresh: FieldTranslations<string>;
	left: number; // texts still waiting for a translation
	save: Save;
};

const text = (row: Row, field: string) => {
	const value = row[field];
	return typeof value === "string" ? value : "";
};
// The translations as read, for the compare-and-set (SQL NULL stays NULL).
const readBack = (row: Row) => (row.translations == null ? null : JSON.stringify(row.translations));

const MAX_TEXT = 10_000;
const jobs: Job[] = [];
let oversized = 0;
const plan = (rows: Row[], fields: readonly string[], save: Save, label: string) => {
	for (const row of rows) {
		// A blank Catalan field has nothing to translate (the site falls back to
		// Catalan), so it is skipped; otherwise it would count as work forever.
		const todo = missingFields(row.translations, fields).filter((f) => {
			const length = text(row, f).trim() ? text(row, f).length : 0;
			if (length > MAX_TEXT) {
				// One huge text must not block every run; translate it in the admin.
				console.warn(`${label} ${row.id}: ${f} has ${length} characters (over ${MAX_TEXT}), skipped`);
				oversized++;
				return false;
			}
			return length > 0;
		});
		if (todo.length) jobs.push({ label, row, todo, fresh: {}, left: todo.length, save });
	}
};

plan(
	(await sql`SELECT id, title, description, full_description, duration, translations FROM project ORDER BY id`) as Row[],
	PROJECT_FIELDS,
	(row, t) => sql`
		UPDATE project SET translations = ${t}::jsonb
		WHERE id = ${row.id}
			AND translations IS NOT DISTINCT FROM ${readBack(row)}::jsonb
			AND title IS NOT DISTINCT FROM ${row.title}
			AND description IS NOT DISTINCT FROM ${row.description}
			AND full_description IS NOT DISTINCT FROM ${row.full_description}
			AND duration IS NOT DISTINCT FROM ${row.duration}
		RETURNING id`,
	"project",
);
plan(
	(await sql`SELECT id, description, translations FROM feature ORDER BY id`) as Row[],
	["description"],
	(row, t) => sql`
		UPDATE feature SET translations = ${t}::jsonb
		WHERE id = ${row.id}
			AND translations IS NOT DISTINCT FROM ${readBack(row)}::jsonb
			AND description IS NOT DISTINCT FROM ${row.description}
		RETURNING id`,
	"feature",
);
plan(
	(await sql`SELECT id, name, translations FROM category ORDER BY id`) as Row[],
	["name"],
	(row, t) => sql`
		UPDATE category SET translations = ${t}::jsonb
		WHERE id = ${row.id}
			AND translations IS NOT DISTINCT FROM ${readBack(row)}::jsonb
			AND name IS NOT DISTINCT FROM ${row.name}
		RETURNING id`,
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
		const source = text(job.row, field);
		if (batch.length && (batch.length === 100 || size + source.length > 1000)) {
			batches.push(batch);
			batch = [];
			size = 0;
		}
		batch.push({ job, field, text: source });
		size += source.length;
	}
}
if (batch.length) batches.push(batch);

const chars = batches.flat().reduce((n, u) => n + u.text.length, 0);
console.log(`target database: ${new URL(process.env.DATABASE_URL).hostname}`);
console.log(
	`planned: ${jobs.length} rows, ${chars} characters in ${batches.length} requests (~${Math.max(0, batches.length - 1) * 10}s of pauses)`,
);
if (!write) {
	console.log("dry run: nothing translated or written. Check the host above, then re-run with --write.");
	process.exit(0);
}

let saved = 0;
let skipped = 0;
let blanks = 0;
const summary = () =>
	`${saved} rows saved, ${skipped} skipped (changed during run), ${blanks} blank answers from Azure, ${oversized} texts over ${MAX_TEXT} characters skipped`;
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
				`${summary()}; ${jobs.length - saved - skipped} rows left untouched. Wait a few minutes and re-run; saved rows are skipped.`,
		);
		process.exit(1);
	}
	for (const [n, { job, field }] of batches[i].entries()) {
		for (const t of TARGETS) {
			const value = result[t][n];
			// A blank answer is a failed translation: not stored, so the field
			// stays missing in that language and the next run retries it.
			if (!value?.trim()) {
				console.warn(`${job.label} ${job.row.id}: blank ${t} ${field} from Azure, not stored`);
				blanks++;
				continue;
			}
			(job.fresh[t] ??= {})[field] = value;
		}
		if (--job.left) continue;
		// Every field is `pending` (none changed): fresh text only fills
		// languages where the stored translation is missing or blank.
		const merged = mergeTranslations(job.row.translations, job.fresh, [], job.todo);
		if (pauseBeforeSave) await new Promise((r) => setTimeout(r, pauseBeforeSave));
		const updated = await job.save(job.row, JSON.stringify(merged));
		if (updated.length) {
			saved++;
			console.log(`${job.label} ${job.row.id}: ${job.todo.join(", ")}`);
		} else {
			skipped++;
			console.log(`${job.label} ${job.row.id}: skipped (changed during run), re-run`);
		}
	}
}
console.log(`backfill done: ${summary()}`);
