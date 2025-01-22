"use server";

import NewProjectForm from "@/app/admin/projects/new/client-new";
import { getCategories } from "@/app/actions/data";
import type { Category } from "@/app/types/types";

export default async function NewProjectPage() {
	const [categories] = await Promise.all([getCategories()]);

	return <NewProjectForm categories={categories as Category[]} />;
}
