import { sql } from "@/lib/db";
import type { Project, User, Category } from "@/types/types";
import { TARGETS, type Locale } from "@/lib/i18n-config";
import { PROJECT_FIELDS } from "@/lib/translate";

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

// `lang` picks the translation; anything untranslated falls back to Catalan.
// The admin calls it without `lang` and gets plain Catalan.
export async function getPortfolioData(lang: Locale = "ca") {
	const data = await sql`
    SELECT
    json_build_object(
      'projects', (
      SELECT json_agg(
        json_build_object(
        'id', p.id,
        'title', trim(COALESCE(NULLIF(btrim(tr.t ->> 'title'), ''), p.title)),
        'description', COALESCE(NULLIF(btrim(tr.t ->> 'description'), ''), p.description),
        'full_description', COALESCE(NULLIF(btrim(tr.t ->> 'full_description'), ''), p.full_description),
        'completion_date', p.completion_date,
        'duration', COALESCE(NULLIF(btrim(tr.t ->> 'duration'), ''), p.duration),
        'category_id', p.category_id,
        'first_image', json_build_object(
          'url', i.url,
          'alt_text', i.alt_text
        ),
        'last_update', p.last_update,
        'updated_by', p.updated_by,
        -- For the admin badge: some field or feature lacks a translation in some
        -- language. A blank Catalan has nothing to translate, so it never counts.
        'translation_pending', (
          EXISTS (
            SELECT 1
            FROM unnest(${[...TARGETS]}::text[]) l, unnest(${[...PROJECT_FIELDS]}::text[]) f
            WHERE NULLIF(btrim(p.translations -> l ->> f), '') IS NULL
              AND btrim(to_jsonb(p) ->> f) <> ''
          ) OR EXISTS (
            SELECT 1
            FROM feature fe, unnest(${[...TARGETS]}::text[]) l
            WHERE fe.project_id = p.id AND NULLIF(btrim(fe.translations -> l ->> 'description'), '') IS NULL
              AND btrim(fe.description) <> ''
          )
        )
        )
        ORDER BY p.id ASC
      )
      FROM project p
      CROSS JOIN LATERAL (SELECT p.translations -> ${lang}::text AS t) tr
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
        'name', COALESCE(NULLIF(btrim(c.translations -> ${lang}::text ->> 'name'), ''), c.name),
        -- Matched on the Catalan column so the "all" filter works in every language.
        'is_all', lower(trim(c.name)) = 'tots els projectes'
        )
        ORDER BY c.id
      )
      FROM category c
      )
    ) as portfolio_data
  `;

	return data[0].portfolio_data;
}

export async function getProjectDetails(id: number, lang: Locale = "ca") {
	// project.id is a smallint: comparing it with a bare parameter makes
	// Postgres parse the parameter as smallint, so an id above 32767 threw
	// "out of range" instead of matching no row. ::bigint makes it just miss.
	// json_agg over zero rows is NULL, not []. COALESCE keeps features and
	// images arrays for a project with no features or photos, so the detail
	// page's images[0] / images.slice(1) / features.map don't throw.
	const [project] = await sql`
    SELECT
      p.id, p.completion_date, p.category_id, p.last_update, p.updated_by, p.translations,
      COALESCE(NULLIF(btrim(tr.t ->> 'title'), ''), p.title) AS title,
      COALESCE(NULLIF(btrim(tr.t ->> 'description'), ''), p.description) AS description,
      COALESCE(NULLIF(btrim(tr.t ->> 'full_description'), ''), p.full_description) AS full_description,
      COALESCE(NULLIF(btrim(tr.t ->> 'duration'), ''), p.duration) AS duration,
      COALESCE(NULLIF(btrim(c.translations -> ${lang}::text ->> 'name'), ''), c.name) AS category_name,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', f.id,
            'description', COALESCE(NULLIF(btrim(f.translations -> ${lang}::text ->> 'description'), ''), f.description),
            'project_id', f.project_id,
            'translations', f.translations
          ) ORDER BY f.id
        )
        FROM feature f
        WHERE f.project_id = p.id
      ), '[]'::json) as features,
      COALESCE((
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
      ), '[]'::json) as images
    FROM project p
    CROSS JOIN LATERAL (SELECT p.translations -> ${lang}::text AS t) tr
    LEFT JOIN category c ON p.category_id = c.id
    WHERE p.id = ${id}::bigint
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

export async function getCategories(): Promise<Category[]> {
	try {
		return (await sql`
      SELECT id, name 
      FROM category
      WHERE lower(trim(name)) NOT IN ('tots els projectes', 'todos los proyectos')
      ORDER BY id ASC
    `) as Category[];
	} catch (error) {
		console.error("Error al obtener categorías:", error);
		return [];
	}
}

export async function getCategory(id: number) {
	return (await sql`SELECT * FROM category WHERE id = ${id}`)[0] as Category;
}

export async function getAllImages() {
	return await sql`SELECT * FROM image`;
}

export async function getImagesFromProject(projectId: number) {
	return await sql`SELECT * FROM image WHERE project_id = ${projectId}`;
}

export async function getFeaturesFromProject(projectId: number) {
	return await sql`SELECT * FROM feature WHERE project_id = ${projectId} FOR UPDATE`;
}
