import type { MetadataRoute } from "next";
import type { Project } from "@/types/types";
import { services } from "@/data/services";

const siteUrl = (
	process.env.NEXT_PUBLIC_BASE_URL || "https://www.interfustaandorra.com/"
).replace(/\/$/, "");

const staticPaths = ["", "/about", "/contact", "/services", "/portfolio"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
		url: `${siteUrl}${path}`,
	}));

	const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
		url: `${siteUrl}/services/${service.slug}`,
	}));

	// The DB call is wrapped in try/catch so a missing DATABASE_URL (e.g. in
	// local/preview environments without DB credentials) degrades gracefully
	// to the static routes instead of failing the whole sitemap route. The
	// import is dynamic so that lib/db.ts's module-level throw (when
	// DATABASE_URL is unset) is also caught here rather than crashing this
	// module at import time.
	let projects: Project[] = [];
	try {
		const { getProjects } = await import("@/app/actions/data");
		projects = await getProjects();
	} catch (error) {
		console.error(
			"sitemap: failed to fetch projects, falling back to static routes only:",
			error,
		);
	}

	const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
		url: `${siteUrl}/portfolio/${project.id}`,
		...(project.last_update
			? { lastModified: new Date(project.last_update) }
			: {}),
	}));

	return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
