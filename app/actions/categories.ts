"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { mergeTranslations, missingFields, translateFields } from "@/lib/translate";
import { getCurrentUser } from "./auth";

export async function createCategory(categoryData: { name: string }) {
	if (!(await getCurrentUser())) return { error: "No autoritzat" };

	try {
		const translations = mergeTranslations(
			null,
			await translateFields({ name: categoryData.name }),
			["name"],
		);
		const [newCategory] = await sql`
      INSERT INTO category (name, translations)
      VALUES (${categoryData.name}, ${JSON.stringify(translations)}::jsonb)
      RETURNING id, name
    `;

		revalidatePath("/admin/categories");
		revalidatePath("/admin/projects");
		revalidatePath("/", "layout");
		return { success: true, category: newCategory };
	} catch (error) {
		console.error("Error al crear categoría:", error);
		return { error: "No s'ha pogut crear la categoria" };
	}
}

export async function updateCategory(
	id: number,
	categoryData: { name: string },
) {
	if (!(await getCurrentUser())) return { error: "No autoritzat" };

	try {
		const [old] = await sql`SELECT name, translations FROM category WHERE id = ${id}`;
		if (!old) return { error: "No s'ha trobat la categoria" };
		// A rename replaces the translations (dropped if translating fails, so
		// the site falls back to the new Catalan); an unchanged name that a
		// previous attempt left untranslated only fills the missing languages.
		const changed = old.name !== categoryData.name ? (["name"] as const) : [];
		const pending = changed.length ? [] : missingFields(old.translations, ["name"] as const);
		const translations = mergeTranslations(
			old.translations,
			changed.length || pending.length
				? await translateFields({ name: categoryData.name })
				: null,
			changed,
			pending,
		);
		const [updatedCategory] = await sql`
	  UPDATE category
	  SET name = ${categoryData.name}, translations = ${JSON.stringify(translations)}::jsonb
	  WHERE id = ${id}
	  RETURNING id, name
	`;

		if (!updatedCategory) {
			return { error: "No s'ha trobat la categoria" };
		}

		revalidatePath("/admin/categories");
		revalidatePath("/admin/projects");
		revalidatePath("/", "layout");
		return { success: true, category: updatedCategory };
	} catch (error) {
		console.error("Error al actualizar categoría:", error);
		return { error: "No s'ha pogut canviar el nom" };
	}
}

export async function deleteCategory(id: number) {
	if (!(await getCurrentUser())) return { error: "No autoritzat" };

	try {
		// Verificar si hay proyectos usando esta categoría
		const [projectCount] = await sql`
      SELECT COUNT(*) FROM project WHERE category_id = ${id}
    `;

		if (projectCount.count > 0) {
			return {
				error: "No es pot eliminar: hi ha projectes en aquesta categoria",
			};
		}

		const [deletedCategory] = await sql`
	  DELETE FROM category 
	  WHERE id = ${id}
	  RETURNING id, name
	`;

		if (!deletedCategory) {
			return { error: "No s'ha trobat la categoria" };
		}

		revalidatePath("/admin/categories");
		revalidatePath("/admin/projects");
		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		console.error("Error al eliminar categoría:", error);
		return { error: "No s'ha pogut eliminar la categoria" };
	}
}
