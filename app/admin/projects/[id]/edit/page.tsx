import { notFound } from "next/navigation";
import {
	getProjectDetails,
	getCategories,
	getFeaturesFromProject,
} from "@/app/actions/data";
import { updateProjectAction } from "@/app/actions/project";
import EditProjectForm from "./client-edit";
import type { Category, Feature, Project } from "@/app/types/types";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
	const { id } = await params;
	const [project, categories, features] = await Promise.all([
		getProjectDetails(Number.parseInt(id)),
		getCategories(),
		getFeaturesFromProject(Number.parseInt(id)),
	]);

	if (!project) {
		return notFound();
	}
	return (
		<EditProjectForm
			project={project as Project}
			categories={categories as Category[]}
			featuresData={features as Feature[]}
			updateProject={updateProjectAction}
		/>
	);
}
