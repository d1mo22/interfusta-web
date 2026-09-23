import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getProjectDetails, getCategories } from "@/app/actions/data";
import ProjectWizard from "../../project-wizard";
import type { Feature, ImageData } from "@/types/types";

export default async function EditProjectPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const id = Number.parseInt((await params).id);
	if (Number.isNaN(id)) notFound();

	const [project, categories] = await Promise.all([
		getProjectDetails(id),
		getCategories(),
	]);
	if (!project) notFound();

	return (
		<ProjectWizard
			categories={categories}
			initial={{
				id: project.id,
				title: project.title,
				categoryId: project.category_id,
				description: project.description,
				fullDescription: project.full_description,
				completionDate: format(new Date(project.completion_date), "yyyy-MM-dd"),
				duration: project.duration,
				features: ((project.features ?? []) as Feature[]).map((f) => f.description),
				photos: ((project.images ?? []) as ImageData[]).map((i) => ({
					id: i.id,
					url: i.url,
				})),
			}}
		/>
	);
}
