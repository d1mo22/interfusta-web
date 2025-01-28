"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";

export async function createCategory(categoryData: { name: string }) {
	try {
		const [newCategory] = await sql`
      INSERT INTO category (name)
      VALUES (${categoryData.name})
      RETURNING id, name
    `;

		revalidatePath("/admin/categories");
		revalidatePath("/admin/projects");
		return { success: true, category: newCategory };
	} catch (error) {
		console.error("Error al crear categoría:", error);
		return { error: "Error al crear la categoría" };
	}
}

export async function updateCategory(
	id: number,
	categoryData: { name: string },
) {
	try {
		const [updatedCategory] = await sql`
	  UPDATE category 
	  SET name = ${categoryData.name}
	  WHERE id = ${id}
	  RETURNING id, name
	`;

		if (!updatedCategory) {
			return { error: "Categoría no encontrada" };
		}

		revalidatePath("/admin/categories");
		revalidatePath("/admin/projects");
		return { success: true, category: updatedCategory };
	} catch (error) {
		console.error("Error al actualizar categoría:", error);
		return { error: "Error al actualizar la categoría" };
	}
}

export async function deleteCategory(id: number) {
	try {
		// Verificar si hay proyectos usando esta categoría
		const [projectCount] = await sql`
      SELECT COUNT(*) FROM project WHERE category_id = ${id}
    `;

		if (projectCount.count > 0) {
			return {
				error: "No se puede eliminar: Hay proyectos usando esta categoría",
			};
		}

		const [deletedCategory] = await sql`
	  DELETE FROM category 
	  WHERE id = ${id}
	  RETURNING id, name
	`;

		if (!deletedCategory) {
			return { error: "Categoría no encontrada" };
		}

		revalidatePath("/admin/categories");
		revalidatePath("/admin/projects");
		return { success: true };
	} catch (error) {
		console.error("Error al eliminar categoría:", error);
		return { error: "Error al eliminar la categoría" };
	}
}
