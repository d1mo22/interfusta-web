import type { MetadataRoute } from "next";
import type { Project } from "@/types/types";
import { services } from "@/data/services";
import { alternates, locales, localeHref, type Locale } from "@/lib/i18n-config";
import { absoluteUrl } from "@/lib/site";

const staticPaths = ["/", "/about", "/contact", "/services", "/portfolio", "/privacitat"];

type Entry = MetadataRoute.Sitemap[number];

// One entry per language for a page. Each lists all five versions plus
// x-default, the same set the page's own <head> carries.
function localized(path: string, extra: Omit<Entry, "url" | "alternates"> = {}): Entry[] {
	const languages = Object.fromEntries(
		Object.entries(alternates("ca", path).languages).map(([l, href]) => [l, absoluteUrl(href)]),
	) as Record<Locale | "x-default", string>;
	return locales.map((lang) => ({
		url: absoluteUrl(localeHref(lang, path)),
		...extra,
		alternates: { languages },
	}));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

	return [
		...staticPaths.flatMap((path) => localized(path)),
		...services.flatMap((service) => localized(`/services/${service.slug}`)),
		...projects.flatMap((project) =>
			localized(
				`/portfolio/${project.id}`,
				project.last_update ? { lastModified: new Date(project.last_update) } : {},
			),
		),
	];
}
