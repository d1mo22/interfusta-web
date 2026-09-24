// Locale facts and pure helpers. No imports on purpose: proxy.ts, client
// components, server code and the node check scripts all load this file.

export const TARGETS = ["es", "fr", "en", "pt"] as const;
export const locales = ["ca", ...TARGETS] as const;
export type Target = (typeof TARGETS)[number];
export type Locale = (typeof locales)[number];
export const defaultLocale = "ca" satisfies Locale;
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value: string | undefined): value is Locale =>
	(locales as readonly string[]).includes(value ?? "");

// Shown in the language switcher, always in their own language.
export const LANGUAGE_NAMES: Record<Locale, string> = {
	ca: "Català",
	es: "Español",
	fr: "Français",
	en: "English",
	pt: "Português",
};

// BCP 47 tags for Intl dates, og:locale and JSON-LD inLanguage. Bare "pt" and
// "en" would format as Brazil and the US; "ca-AD" is what the JSON-LD already said.
export const intlLocale: Record<Locale, string> = {
	ca: "ca-AD",
	es: "es-ES",
	fr: "fr-FR",
	en: "en-GB",
	pt: "pt-PT",
};

// Open Graph wants underscores: "pt_PT".
export const ogLocale = (lang: Locale) => intlLocale[lang].replace("-", "_");

// Catalan lives unprefixed (existing URLs keep working); the rest under /xx.
export function localeHref(lang: Locale, path: string): string {
	if (lang === defaultLocale) return path;
	return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

// "/fr/portfolio" -> "/portfolio", "/fr" -> "/", "/portfolio" unchanged.
export function stripLocale(pathname: string): string {
	const [, first, ...rest] = pathname.split("/");
	return hasLocale(first) ? `/${rest.join("/")}` : pathname;
}

// Picks the best supported language from an Accept-Language header.
// ponytail: hand-rolled instead of negotiator; only primary subtags matter here.
export function matchAcceptLanguage(header: string | null | undefined): Locale {
	const ranked = (header ?? "")
		.split(",")
		.map((part) => {
			const [tag, ...params] = part.split(";").map((s) => s.trim());
			const q = params.find((p) => p.startsWith("q="));
			return {
				lang: tag.split("-")[0].toLowerCase(),
				q: q ? Number(q.slice(2)) : 1,
			};
		})
		.filter((entry) => entry.q > 0) // also drops NaN from a malformed q
		.sort((a, b) => b.q - a.q);
	const match = ranked.find((entry) => hasLocale(entry.lang));
	return match ? (match.lang as Locale) : defaultLocale;
}

export type LocaleDecision =
	| { action: "next" }
	| { action: "redirect"; pathname: string; permanent?: true; setCookie?: Locale }
	| { action: "rewrite"; pathname: string; setCookie?: Locale };

// What proxy.ts does with a public-page request. The cookie (set by the
// switcher or a previous detection) beats Accept-Language; detection only
// runs when there's no valid cookie, and its result is remembered.
export function resolveLocale(
	pathname: string,
	cookie: string | undefined,
	acceptLanguage: string | null,
): LocaleDecision {
	const first = pathname.split("/")[1];
	if (first === defaultLocale)
		return { action: "redirect", pathname: stripLocale(pathname), permanent: true };
	if (hasLocale(first)) return { action: "next" };

	const remembered = hasLocale(cookie) ? cookie : undefined;
	const lang = remembered ?? matchAcceptLanguage(acceptLanguage);
	const remember = remembered ? {} : { setCookie: lang };
	if (lang !== defaultLocale)
		return { action: "redirect", pathname: localeHref(lang, pathname), ...remember };
	return {
		action: "rewrite",
		pathname: pathname === "/" ? "/ca" : `/ca${pathname}`,
		...remember,
	};
}

// Canonical + hreflang links for one page. Paths are relative; metadataBase
// makes them absolute in <head>, and the sitemap prefixes siteUrl itself.
export function alternates(lang: Locale, path: string) {
	return {
		canonical: localeHref(lang, path),
		languages: {
			...Object.fromEntries(locales.map((l) => [l, localeHref(l, path)])),
			"x-default": path,
		} as Record<Locale | "x-default", string>,
	};
}

// The share image every public page used before i18n.
export const OG_IMAGE = { url: "/thumbnail.webp", width: 1280, height: 720 };

// Title, description, canonical/hreflang and Open Graph for one page. A page's
// openGraph replaces the layout's wholesale, so the image is repeated here.
export function pageMetadata(lang: Locale, path: string, title: string, description: string) {
	return {
		title,
		description,
		alternates: alternates(lang, path),
		openGraph: {
			title,
			description,
			locale: ogLocale(lang),
			images: [OG_IMAGE],
		},
	};
}

// "Imatge {n}" + { n: 2 } -> "Imatge 2". Unknown keys are left visible.
export const fill = (template: string, vars: Record<string, string | number>) =>
	template.replace(/\{(\w+)\}/g, (match, key: string) =>
		key in vars ? String(vars[key]) : match,
	);
