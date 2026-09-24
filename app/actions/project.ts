"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { deleteR2Urls } from "@/lib/r2Client";
import { TARGETS } from "@/lib/i18n-config";
import {
	PROJECT_FIELDS,
	mergeTranslations,
	missingFields,
	sanitizeTranslations,
	translateTexts,
	translationPlan,
	translationsAfterSave,
	type FieldTranslations,
	type ProjectField,
} from "@/lib/translate";

export type ProjectInput = {
	title: string;
	categoryId: number;
	description: string;
	fullDescription: string;
	completionDate: string;
	duration: string;
	features: string[];
	// In display order; the first one is the cover. Existing photos travel by id,
	// new uploads by the R2 url the upload route returned.
	images: { id?: number; url?: string }[];
};

type Result = { id?: number; error?: string };

const isText = (v: unknown): v is string =>
	typeof v === "string" && v.trim() !== "";

// Same rules the wizard enforces step by step; repeated here because the
// client can't be trusted.
function invalid(p: ProjectInput): string | null {
	if (![p.title, p.description, p.fullDescription, p.duration].every(isText))
		return "Falten camps obligatoris";
	if (!Number.isInteger(p.categoryId)) return "Tria una categoria";
	if (Number.isNaN(Date.parse(p.completionDate))) return "La data no és vàlida";
	if (!Array.isArray(p.features) || !p.features.length || !p.features.every(isText))
		return "Afegeix almenys una característica";
	if (!Array.isArray(p.images) || !p.images.length)
		return "Afegeix almenys una foto";
	return null;
}

// Resolves the ordered image list to urls: ids must belong to this project,
// new urls must point at our bucket.
function resolveUrls(
	images: ProjectInput["images"],
	current: Map<number, string>,
): string[] | null {
	const prefix = `${process.env.R2_URL}/`;
	const urls = images.map((i) =>
		i.id != null
			? current.get(i.id)
			: i.url?.startsWith(prefix)
				? i.url
				: undefined,
	);
	return urls.every(Boolean) ? (urls as string[]) : null;
}

// Public pages live under app/[lang] (/ca/portfolio, /fr/portfolio, ...), so the
// browser paths (/portfolio) no longer match any cache entry. The "/" layout tag
// is on every page, so this refreshes every locale in one call.
function revalidate() {
	revalidatePath("/", "layout");
	revalidatePath("/admin");
}

const fieldsOf = (p: ProjectInput): Record<ProjectField, string> => ({
	title: p.title.trim(),
	description: p.description.trim(),
	full_description: p.fullDescription.trim(),
	duration: p.duration.trim(),
});

type FeatureRow = {
	description: string;
	translations: FieldTranslations<"description"> | null;
};

type ProjectRow = Record<ProjectField, string> & {
	translations: FieldTranslations<ProjectField> | null;
};

// One translation object per feature, in order. Features are matched to the
// stored ones by their Catalan text: a match keeps its translations (hand
// edits included) and only fills missing languages; a new or edited text is
// translated from scratch. Everything that needs Azure goes in one request.
async function featureTranslations(
	features: string[],
	old: FeatureRow[],
): Promise<FieldTranslations<"description">[]> {
	const byText = new Map<string, FeatureRow>();
	for (const f of old) {
		const seen = byText.get(f.description);
		// With duplicate texts, prefer the fully translated row.
		if (!seen || missingFields(seen.translations, ["description"]).length > 0)
			byText.set(f.description, f);
	}
	const plans = features.map((d) => {
		const row = byText.get(d);
		return { d, row, ...translationPlan({ description: d }, row, ["description"] as const) };
	});
	const todo = [
		...new Set(plans.filter((p) => p.changed.length || p.pending.length).map((p) => p.d)),
	];
	const result = todo.length ? await translateTexts(todo) : null;
	return plans.map(({ d, row, changed, pending }) => {
		const i = todo.indexOf(d);
		const fresh =
			result && i >= 0
				? Object.fromEntries(TARGETS.map((t) => [t, { description: result[t][i] }]))
				: null;
		return mergeTranslations(row?.translations, fresh, changed, pending);
	});
}

export async function createProject(p: ProjectInput): Promise<Result> {
	const user = await getCurrentUser();
	if (!user) return { error: "No autoritzat" };

	const error = invalid(p);
	if (error) return { error };
	const urls = resolveUrls(p.images, new Map());
	if (!urls) return { error: "Alguna foto no s'ha pujat bé" };

	const fields = fieldsOf(p);
	const [translations, featureTr] = await Promise.all([
		translationsAfterSave(fields, undefined, PROJECT_FIELDS),
		featureTranslations(p.features, []),
	]);

	try {
		// One statement so a failure never leaves a project without its photos.
		const [{ id }] = await sql`
			WITH p AS (
				INSERT INTO project (title, description, full_description, completion_date, duration, category_id, updated_by, last_update, translations)
				VALUES (${fields.title}, ${fields.description}, ${fields.full_description}, ${p.completionDate}, ${fields.duration}, ${p.categoryId}, ${user.name}, NOW(), ${JSON.stringify(translations)}::jsonb)
				RETURNING id
			), f AS (
				INSERT INTO feature (project_id, description, translations)
				SELECT p.id, x.d, x.t
				FROM p, unnest(${p.features}::text[], ${featureTr.map((t) => JSON.stringify(t))}::jsonb[]) AS x(d, t)
			), i AS (
				INSERT INTO image (project_id, url, alt_text, "order")
				SELECT p.id, t.url, ${fields.title}, t.ord - 1
				FROM p, unnest(${urls}::text[]) WITH ORDINALITY AS t(url, ord)
			)
			SELECT id FROM p
		`;
		revalidate();
		return { id };
	} catch (e) {
		console.error("Error creating project:", e);
		return { error: "No s'ha pogut desar el projecte. Torna-ho a provar." };
	}
}

export async function updateProject(
	id: number,
	p: ProjectInput,
): Promise<Result> {
	const user = await getCurrentUser();
	if (!user) return { error: "No autoritzat" };

	const error = invalid(p);
	if (error) return { error };

	try {
		const [old] = (await sql`
			SELECT title, description, full_description, duration, translations
			FROM project WHERE id = ${id}
		`) as ProjectRow[];
		if (!old) return { error: "No s'ha trobat el projecte" };
		const [current, oldFeatures] = await Promise.all([
			sql`SELECT id, url FROM image WHERE project_id = ${id}`,
			sql`SELECT description, translations FROM feature WHERE project_id = ${id}`,
		]);
		const urls = resolveUrls(
			p.images,
			new Map(current.map((r) => [r.id as number, r.url as string])),
		);
		if (!urls) return { error: "Alguna foto no s'ha pujat bé" };

		const fields = fieldsOf(p);
		const [translations, featureTr] = await Promise.all([
			translationsAfterSave(fields, old, PROJECT_FIELDS),
			featureTranslations(p.features, oldFeatures as FeatureRow[]),
		]);

		await sql.transaction([
			sql`
				UPDATE project SET
					title = ${fields.title},
					description = ${fields.description},
					full_description = ${fields.full_description},
					completion_date = ${p.completionDate},
					duration = ${fields.duration},
					category_id = ${p.categoryId},
					translations = ${JSON.stringify(translations)}::jsonb,
					last_update = NOW(),
					updated_by = ${user.name}
				WHERE id = ${id}
			`,
			sql`DELETE FROM feature WHERE project_id = ${id}`,
			sql`
				INSERT INTO feature (project_id, description, translations)
				SELECT ${id}, x.d, x.t
				FROM unnest(${p.features}::text[], ${featureTr.map((t) => JSON.stringify(t))}::jsonb[]) AS x(d, t)
			`,
			sql`DELETE FROM image WHERE project_id = ${id}`,
			sql`
				INSERT INTO image (project_id, url, alt_text, "order")
				SELECT ${id}, t.url, ${fields.title}, t.ord - 1
				FROM unnest(${urls}::text[]) WITH ORDINALITY AS t(url, ord)
			`,
		]);

		// Files go only after the rows are safely gone.
		const kept = new Set(urls);
		await deleteR2Urls(
			current.map((r) => r.url as string).filter((u) => !kept.has(u)),
		);
		revalidate();
		return { id };
	} catch (e) {
		console.error("Error updating project:", e);
		return { error: "No s'han pogut desar els canvis. Torna-ho a provar." };
	}
}

export async function deleteProject(id: number): Promise<Result> {
	if (!(await getCurrentUser())) return { error: "No autoritzat" };

	try {
		const [images] = await sql.transaction([
			sql`DELETE FROM image WHERE project_id = ${id} RETURNING url`,
			sql`DELETE FROM feature WHERE project_id = ${id}`,
			sql`DELETE FROM project WHERE id = ${id}`,
		]);
		await deleteR2Urls(images.map((r) => r.url as string));
		revalidate();
		return { id };
	} catch (e) {
		console.error("Error deleting project:", e);
		return { error: "No s'ha pogut eliminar el projecte" };
	}
}

// Hand edits from the Traduccions tab. Stored as typed (sanitized); a field
// left blank falls back to Catalan on the site and shows as pending.
export async function updateProjectTranslations(
	id: number,
	input: { project: unknown; features: { id: number; translations: unknown }[] },
): Promise<Result> {
	const user = await getCurrentUser();
	if (!user) return { error: "No autoritzat" };

	const project = sanitizeTranslations(input?.project, PROJECT_FIELDS);
	const features = (Array.isArray(input?.features) ? input.features : []).filter((f) =>
		Number.isInteger(f?.id),
	);

	try {
		const [updated] = await sql.transaction([
			sql`
				UPDATE project
				SET translations = ${JSON.stringify(project)}::jsonb, last_update = NOW(), updated_by = ${user.name}
				WHERE id = ${id}
				RETURNING id
			`,
			...features.map(
				(f) => sql`
					UPDATE feature
					SET translations = ${JSON.stringify(sanitizeTranslations(f.translations, ["description"]))}::jsonb
					WHERE id = ${f.id} AND project_id = ${id}
				`,
			),
		]);
		if (!updated.length) return { error: "No s'ha trobat el projecte" };
		revalidate();
		return { id };
	} catch (e) {
		console.error("Error saving translations:", e);
		return { error: "No s'han pogut desar les traduccions. Torna-ho a provar." };
	}
}

// The jsonb as read, for the compare-and-set below (SQL NULL stays NULL).
const readBack = (t: unknown) => (t == null ? null : JSON.stringify(t));

// "Retradueix el que falta": the Catalan is unchanged, so every field or
// feature that needs work is pending and only its missing languages are
// filled; hand edits stay. Saves only rows nobody changed while Azure was
// answering, so a concurrent edit is never overwritten with stale text.
export async function retranslateProject(id: number): Promise<Result> {
	if (!(await getCurrentUser())) return { error: "No autoritzat" };

	try {
		const [row] = (await sql`
			SELECT title, description, full_description, duration, translations
			FROM project WHERE id = ${id}
		`) as ProjectRow[];
		if (!row) return { error: "No s'ha trobat el projecte" };
		const features = (await sql`
			SELECT id, description, translations FROM feature WHERE project_id = ${id} ORDER BY id
		`) as (FeatureRow & { id: number })[];

		const [translations, featureTr] = await Promise.all([
			translationsAfterSave(row, row, PROJECT_FIELDS),
			featureTranslations(
				features.map((f) => f.description),
				features,
			),
		]);

		await sql.transaction([
			sql`
				UPDATE project SET translations = ${JSON.stringify(translations)}::jsonb
				WHERE id = ${id}
					AND translations IS NOT DISTINCT FROM ${readBack(row.translations)}::jsonb
					AND title IS NOT DISTINCT FROM ${row.title}
					AND description IS NOT DISTINCT FROM ${row.description}
					AND full_description IS NOT DISTINCT FROM ${row.full_description}
					AND duration IS NOT DISTINCT FROM ${row.duration}
			`,
			...features.map(
				(f, i) => sql`
					UPDATE feature SET translations = ${JSON.stringify(featureTr[i])}::jsonb
					WHERE id = ${f.id}
						AND translations IS NOT DISTINCT FROM ${readBack(f.translations)}::jsonb
						AND description IS NOT DISTINCT FROM ${f.description}
				`,
			),
		]);
		revalidate();

		// A blank Catalan has nothing to translate, so it never counts as missing.
		const stillMissing =
			translationPlan(row, { ...row, translations }, PROJECT_FIELDS).pending.length > 0 ||
			features.some(
				(f, i) =>
					translationPlan(f, { ...f, translations: featureTr[i] }, ["description"] as const)
						.pending.length > 0,
			);
		return stillMissing
			? { error: "El traductor no respon. Torna-ho a provar més tard." }
			: { id };
	} catch (e) {
		console.error("Error retranslating project:", e);
		return { error: "No s'ha pogut traduir el projecte. Torna-ho a provar." };
	}
}
