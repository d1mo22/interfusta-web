"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { deleteR2Urls } from "@/lib/r2Client";

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

function revalidate(id: number) {
	revalidatePath("/");
	revalidatePath("/admin");
	revalidatePath("/portfolio");
	revalidatePath(`/portfolio/${id}`);
}

export async function createProject(p: ProjectInput): Promise<Result> {
	const user = await getCurrentUser();
	if (!user) return { error: "No autoritzat" };

	const error = invalid(p);
	if (error) return { error };
	const urls = resolveUrls(p.images, new Map());
	if (!urls) return { error: "Alguna foto no s'ha pujat bé" };

	try {
		// One statement so a failure never leaves a project without its photos.
		const [{ id }] = await sql`
			WITH p AS (
				INSERT INTO project (title, description, full_description, completion_date, duration, category_id, updated_by, last_update)
				VALUES (${p.title.trim()}, ${p.description.trim()}, ${p.fullDescription.trim()}, ${p.completionDate}, ${p.duration.trim()}, ${p.categoryId}, ${user.name}, NOW())
				RETURNING id
			), f AS (
				INSERT INTO feature (project_id, description)
				SELECT p.id, unnest(${p.features}::text[]) FROM p
			), i AS (
				INSERT INTO image (project_id, url, alt_text, "order")
				SELECT p.id, t.url, ${p.title.trim()}, t.ord - 1
				FROM p, unnest(${urls}::text[]) WITH ORDINALITY AS t(url, ord)
			)
			SELECT id FROM p
		`;
		revalidate(id);
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
		const current = await sql`SELECT id, url FROM image WHERE project_id = ${id}`;
		const urls = resolveUrls(
			p.images,
			new Map(current.map((r) => [r.id as number, r.url as string])),
		);
		if (!urls) return { error: "Alguna foto no s'ha pujat bé" };

		await sql.transaction([
			sql`
				UPDATE project SET
					title = ${p.title.trim()},
					description = ${p.description.trim()},
					full_description = ${p.fullDescription.trim()},
					completion_date = ${p.completionDate},
					duration = ${p.duration.trim()},
					category_id = ${p.categoryId},
					last_update = NOW(),
					updated_by = ${user.name}
				WHERE id = ${id}
			`,
			sql`DELETE FROM feature WHERE project_id = ${id}`,
			sql`INSERT INTO feature (project_id, description) SELECT ${id}, unnest(${p.features}::text[])`,
			sql`DELETE FROM image WHERE project_id = ${id}`,
			sql`
				INSERT INTO image (project_id, url, alt_text, "order")
				SELECT ${id}, t.url, ${p.title.trim()}, t.ord - 1
				FROM unnest(${urls}::text[]) WITH ORDINALITY AS t(url, ord)
			`,
		]);

		// Files go only after the rows are safely gone.
		const kept = new Set(urls);
		await deleteR2Urls(
			current.map((r) => r.url as string).filter((u) => !kept.has(u)),
		);
		revalidate(id);
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
		revalidate(id);
		return { id };
	} catch (e) {
		console.error("Error deleting project:", e);
		return { error: "No s'ha pogut eliminar el projecte" };
	}
}
