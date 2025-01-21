"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";

export async function createProject(formData: FormData) {
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

export async function updateProject(id: string, formData: FormData) {
	const user = await getCurrentUser();
	if (!user || user.role !== "admin") {
		return { error: "Unauthorized" };
	}

	// This is where you would typically update the project in the database
	// For now, we'll just return success
	revalidatePath("/admin");
	revalidatePath("/portfolio");
	revalidatePath(`/portfolio/${id}`);
	return { success: true };
}

export async function deleteProject(id: string) {
	const user = await getCurrentUser();
	if (!user || user.role !== "admin") {
		return { error: "Unauthorized" };
	}

	// This is where you would typically delete the project from the database
	// For now, we'll just return success
	revalidatePath("/admin");
	revalidatePath("/portfolio");
	return { success: true };
}
