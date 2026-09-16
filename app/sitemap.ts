import type { MetadataRoute } from "next";
import { getProjects } from "@/app/actions/data";

const baseUrl =
	process.env.NEXT_PUBLIC_BASE_URL || "https://interfustaandorra.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticRoutes: MetadataRoute.Sitemap = [
		"",
		"/services",
		"/about",
		"/contact",
		"/portfolio",
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
	}));

	try {
		const projects = await getProjects();
		const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
			url: `${baseUrl}/portfolio/${project.id}`,
			lastModified: project.last_update
				? new Date(project.last_update)
				: new Date(),
		}));
		return [...staticRoutes, ...projectRoutes];
	} catch {
		return staticRoutes;
	}
}
