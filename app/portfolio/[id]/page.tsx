import { notFound } from "next/navigation";
import ClientPage from "./clientPage";
import {
	getCategory,
	getFeaturesFromProject,
	getImagesFromProject,
	getProjectDetails,
} from "@/app/actions/data";

import type { Project, Image, Feature } from "@/app/types/database";

export default async function ProjectDetails({
	params,
}: { params: { id: number } }) {
	const project = (await getProjectDetails(params.id)) as Project;
	const images = (await getImagesFromProject(params.id)) as Image[];
	const features = (await getFeaturesFromProject(params.id)) as Feature[];
	const category_name = (await getCategory(project.category_id)).name as string;

	if (!project) {
		notFound();
	}

	return (
		<ClientPage
			project={project}
			images={images}
			features={features}
			category_name={category_name}
		/>
	);
}
