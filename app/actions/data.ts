import { sql } from "@/app/lib/db";
import type { Project, User, Category, Image } from "@/app/types/database";

export async function getProjects() {
	return (await sql`
	  SELECT 
		p.*,
		json_build_object(
		  'url', i.url,
		  'alt_text', i.alt_text
		) as first_image
	  FROM project p
	  LEFT JOIN (
		SELECT DISTINCT ON (project_id) *
		FROM image
		ORDER BY project_id, "order" ASC
	  ) i ON i.project_id = p.id
	`) as Project[];
}

export async function getProjectDetails(id: number) {
	const [project] = await sql`
	  SELECT 
		p.*,
		c.name as category_name,
		json_agg(DISTINCT f.description) as feature,
		json_agg(
		  DISTINCT jsonb_build_object(
			'id', i.id,
			'url', i.url,
			'alt_text', i.alt_text
		  )
		) as images
	  FROM project p
	  LEFT JOIN category c ON p.category_id = c.id
	  LEFT JOIN feature f ON f.project_id = p.id
	  LEFT JOIN image i ON i.project_id = p.id
	  WHERE p.id = ${id}
	  GROUP BY p.id, c.name
	`;
	return project;
}

export async function getUsers(): Promise<User[]> {
	return (await sql`SELECT * FROM users`) as User[];
}

export async function getUser(username: string): Promise<User> {
	return (
		await sql`SELECT * FROM users WHERE username = ${username}`
	)[0] as User;
}

export async function getCategories() {
	return (await sql`SELECT * FROM category ORDER BY id`) as Category[];
}

export async function getCategory(id: number) {
	return (await sql`SELECT * FROM category WHERE id = ${id}`)[0] as Category;
}

export async function getAllImages() {
	return await sql`SELECT * FROM image`;
}

/**
 * This function gets the header images
 * @returns an array of images
 */
export async function getHeaderImages() {
	return (await sql`SELECT * FROM image WHERE "order" = 0`) as Image[];
}

export async function getImagesFromProject(projectId: number) {
	return await sql`SELECT * FROM image WHERE project_id = ${projectId}`;
}

export async function getFeaturesFromProject(projectId: number) {
	return await sql`SELECT * FROM feature WHERE project_id = ${projectId}`;
}
