import { sql } from "@/app/lib/db";
import type { Project, User, Category, ImageData } from "@/app/types/types";

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

export async function getPortfolioData() {
	const data = await sql`
    SELECT 
    json_build_object(
      'projects', (
      SELECT json_agg(
        json_build_object(
        'id', p.id,
        'title', p.title,
        'description', p.description,
        'full_description', p.full_description,
        'completion_date', p.completion_date,
        'duration', p.duration,
        'category_id', p.category_id,
        'first_image', json_build_object(
          'url', i.url,
          'alt_text', i.alt_text
        ),
        'last_update', p.last_update,
        'updated_by', p.updated_by
        )
        ORDER BY p.id ASC
      )
      FROM project p
      LEFT JOIN (
        SELECT DISTINCT ON (project_id) *
        FROM image
        ORDER BY project_id, "order" ASC
      ) i ON i.project_id = p.id
      ),
      'categories', (
      SELECT json_agg(
        json_build_object(
        'id', c.id,
        'name', c.name
        )
        ORDER BY c.id
      )
      FROM category c
      )
    ) as portfolio_data
  `;

	return data[0].portfolio_data;
}

export async function getProjectDetails(id: number) {
	const [project] = await sql`
    SELECT 
      p.*,
      c.name as category_name,
      (
        SELECT json_agg(
          json_build_object(
            'id', f.id,
            'description', f.description,
            'project_id', f.project_id
          )
        )
        FROM feature f
        WHERE f.project_id = p.id
      ) as features,
      (
        SELECT json_agg(
          json_build_object(
            'id', i.id,
            'url', i.url,
            'alt_text', i.alt_text,
            'project_id', i.project_id,
            'order', i."order"
          ) ORDER BY i."order"
        )
        FROM image i
        WHERE i.project_id = p.id
      ) as images
    FROM project p
    LEFT JOIN category c ON p.category_id = c.id
    WHERE p.id = ${id}
    GROUP BY p.id, c.id, c.name
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
	return (await sql`SELECT * FROM image WHERE "order" = 0`) as ImageData[];
}

export async function getImagesFromProject(projectId: number) {
	return await sql`SELECT * FROM image WHERE project_id = ${projectId}`;
}

export async function getFeaturesFromProject(projectId: number) {
	return await sql`SELECT * FROM feature WHERE project_id = ${projectId}`;
}
