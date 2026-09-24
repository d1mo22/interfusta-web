import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import ClientPage from "./client-page";
import { getProjectDetails } from "@/app/actions/data";
import { getDictionary, getLocale } from "@/lib/i18n";
import { alternates, OG_IMAGE, ogLocale } from "@/lib/i18n-config";
import type { Project, ImageData, Feature } from "@/types/types";

const getCachedProjectDetails = unstable_cache(
	async (id: number) => getProjectDetails(id),
	["project-details"],
	{ revalidate: 3600 },
);

// Memoised per-request so the page and generateMetadata share one lookup.
// Trimmed here so a stray leading/trailing space in the stored title doesn't
// leak into <title>, og:title, or the alt text derived from it downstream.
const getProject = cache(async (id: number) => {
	const project = await getCachedProjectDetails(id);
	if (!project) return project;
	// Spreading an `any`-typed value narrows the inferred object literal type
	// to just the explicit keys, so cast back to keep the rest of `project`'s
	// (implicitly `any`) shape visible to callers below.
	return { ...project, title: project.title.trim() } as typeof project;
});

export async function generateMetadata({
	params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const id = Number.parseInt((await params).id);
	const [project, lang] = await Promise.all([getProject(id), getLocale()]);

	if (!project) {
		return {};
	}

	const image = (project.images as ImageData[] | undefined)?.[0];

	return {
		title: project.title,
		description: project.description,
		alternates: alternates(lang, `/portfolio/${id}`),
		openGraph: {
			title: project.title,
			description: project.description,
			locale: ogLocale(lang),
			// Projects without photos still carry the site share image.
			images: image ? [{ url: image.url }] : [OG_IMAGE],
		},
	};
}

export default async function ProjectDetails({
	params,
}: { params: Promise<{ id: string }> }) {
	const id = Number.parseInt((await params).id);

	const [project, lang, dict] = await Promise.all([getProject(id), getLocale(), getDictionary()]);

	if (!project) {
		notFound();
	}

	return (
		<ClientPage
			project={project as Project}
			images={project.images as ImageData[]}
			features={project.features as Feature[]}
			category_name={project.category_name}
			lang={lang}
			dict={dict.project}
			galleryDict={dict.gallery}
		/>
	);
}
