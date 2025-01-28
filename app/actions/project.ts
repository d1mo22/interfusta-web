"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { insertProjectImages } from "./data";

export async function createProject() {
	const user = await getCurrentUser();
	if (!user || user.role !== "admin") {
		return { error: "Unauthorized" };
	}

	// This is where you would typically create a new project in the database
	// For now, we'll just return success
	revalidatePath("/admin");
	revalidatePath("/portfolio");
	return { success: true };
}

export async function updateProjectAction(formData: FormData) {
	"use server";

	const user = await getCurrentUser();

	try {
		const id = Number(formData.get("id"));
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const fullDescription = formData.get("fullDescription") as string;
		const completionDate = formData.get("completionDate") as string;
		const duration = formData.get("duration") as string;
		const category = formData.get("project-category") as string;
		const features = JSON.parse(formData.get("features") as string);
		const newImages = JSON.parse(formData.get("newImages") as string);

		if (newImages?.length > 0) {
			await insertProjectImages(id, newImages);
		}

		// Actualizar el proyecto en la base de datos
		await sql`
      UPDATE project 
      SET 
        title = ${title},
        description = ${description},
        full_description = ${fullDescription},
        completion_date = ${completionDate},
        duration = ${duration},
        category_id = (SELECT id FROM category WHERE name = ${category}),
        last_update = NOW(),
        updated_by = ${user.name}
      WHERE id = ${id}
    `;

		// Eliminar características anteriores
		await sql`DELETE FROM feature WHERE project_id = ${id}`;

		// Insertar nuevas características
		if (features.length > 0) {
			await sql`
        INSERT INTO feature (project_id, description)
        SELECT ${id}, unnest(${features}::text[])
      `;
		}

		revalidatePath("/admin");
		revalidatePath("/portfolio");
		revalidatePath(`/admin/projects/${id}/edit`);
		revalidatePath(`/portfolio/${id}`);
		return { success: true };
	} catch (error) {
		console.error("Error updating project:", error);
		return { error: "Error al actualizar el proyecto" };
	}
}

export async function deleteProject(id: number) {
	"use server";

	try {
		await sql`DELETE FROM image WHERE project_id = ${id}`;
		await sql`DELETE FROM feature WHERE project_id = ${id}`;
		await sql`DELETE FROM project WHERE id = ${id}`;

		revalidatePath("/admin");
		revalidatePath("/portfolio");
		return { success: true };
	} catch (error) {
		console.error("Error deleting project:", error);
		return { error: "Error al eliminar el proyecto" };
	}
}
