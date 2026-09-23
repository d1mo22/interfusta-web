import { cache } from "react";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import ClientPage from "./client-page";
import { getProjectDetails } from "@/app/actions/data";
import type { Project, ImageData, Feature } from "@/types/types";

const getCachedProjectDetails = unstable_cache(
	async (id: number) => getProjectDetails(id),
	["project-details"],
	{ revalidate: 3600 },
);

// Memoised per-request so the page and generateMetadata share one lookup.
const getProject = cache(async (id: number) => getCachedProjectDetails(id));

export async function generateMetadata({
	params,
}: { params: Promise<{ id: string }> }) {
	const id = Number.parseInt((await params).id);
	const project = await getProject(id);

	if (!project) {
		return {};
	}

	const image = (project.images as ImageData[] | undefined)?.[0];

	return {
		title: project.title,
		description: project.description,
		openGraph: {
			title: project.title,
			description: project.description,
			images: image ? [{ url: image.url }] : undefined,
		},
	};
}

export default async function ProjectDetails({
	params,
}: { params: Promise<{ id: string }> }) {
	const id = Number.parseInt((await params).id);

	const project = await getProject(id);

	if (!project) {
		notFound();
	}

	return (
		<ClientPage
			project={project as Project}
			images={project.images as ImageData[]}
			features={project.features as Feature[]}
			category_name={project.category_name}
		/>
	);
}
