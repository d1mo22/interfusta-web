import type { MetadataRoute } from "next";

const siteUrl = (
	process.env.NEXT_PUBLIC_BASE_URL || "https://www.interfustaandorra.com/"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/admin", "/auth", "/api"],
		},
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}
