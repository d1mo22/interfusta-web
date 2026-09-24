// The public origin without a trailing slash, e.g. https://www.interfustaandorra.com
export const siteUrl = (
	process.env.NEXT_PUBLIC_BASE_URL || "https://www.interfustaandorra.com/"
).replace(/\/$/, "");

// "/" -> siteUrl (no trailing slash, as the sitemap and JSON-LD have always used).
export const absoluteUrl = (path: string) => (path === "/" ? siteUrl : `${siteUrl}${path}`);
