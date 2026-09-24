// Run: node --experimental-strip-types lib/i18n-config.check.ts
import assert from "node:assert";
import {
	alternates,
	fill,
	localeHref,
	matchAcceptLanguage,
	ogLocale,
	pageMetadata,
	resolveLocale,
	stripLocale,
} from "./i18n-config.ts";

// Catalan stays unprefixed, the rest live under /xx
assert.equal(localeHref("ca", "/portfolio"), "/portfolio");
assert.equal(localeHref("ca", "/"), "/");
assert.equal(localeHref("fr", "/portfolio/3"), "/fr/portfolio/3");
assert.equal(localeHref("fr", "/"), "/fr");
assert.equal(stripLocale("/fr/portfolio/3"), "/portfolio/3");
assert.equal(stripLocale("/fr"), "/");
assert.equal(stripLocale("/ca/about"), "/about");
assert.equal(stripLocale("/portfolio"), "/portfolio");
assert.equal(stripLocale("/"), "/");

// Accept-Language: highest q wins, region and case ignored, junk skipped
assert.equal(matchAcceptLanguage("fr-FR,fr;q=0.9,en;q=0.8"), "fr");
assert.equal(matchAcceptLanguage("de-DE,pt-BR;q=0.7,en;q=0.5"), "pt");
assert.equal(matchAcceptLanguage("en;q=0.2,es;q=0.9"), "es");
assert.equal(matchAcceptLanguage("fr;q=0,en;q=0.1"), "en");
assert.equal(matchAcceptLanguage("fr;q=abc,es"), "es");
assert.equal(matchAcceptLanguage("EN-gb"), "en");
assert.equal(matchAcceptLanguage("*"), "ca");
assert.equal(matchAcceptLanguage("de"), "ca");
assert.equal(matchAcceptLanguage(""), "ca");
assert.equal(matchAcceptLanguage(null), "ca");

// Proxy decisions
assert.deepStrictEqual(resolveLocale("/fr/portfolio", undefined, "es"), { action: "next" });
assert.deepStrictEqual(resolveLocale("/ca/portfolio", undefined, null), {
	action: "redirect",
	pathname: "/portfolio",
	permanent: true,
});
assert.deepStrictEqual(resolveLocale("/ca", "fr", null), {
	action: "redirect",
	pathname: "/",
	permanent: true,
});
// First visit: detect, remember, redirect
assert.deepStrictEqual(resolveLocale("/portfolio", undefined, "fr-FR,fr;q=0.9"), {
	action: "redirect",
	pathname: "/fr/portfolio",
	setCookie: "fr",
});
// First visit with a Catalan or unsupported browser: serve Catalan in place
assert.deepStrictEqual(resolveLocale("/", undefined, "ca-ES"), {
	action: "rewrite",
	pathname: "/ca",
	setCookie: "ca",
});
assert.deepStrictEqual(resolveLocale("/about", undefined, "de"), {
	action: "rewrite",
	pathname: "/ca/about",
	setCookie: "ca",
});
// The cookie beats the browser language and isn't set again
assert.deepStrictEqual(resolveLocale("/about", "ca", "fr"), {
	action: "rewrite",
	pathname: "/ca/about",
});
assert.deepStrictEqual(resolveLocale("/about", "en", "fr"), {
	action: "redirect",
	pathname: "/en/about",
});
// A garbage cookie is ignored
assert.deepStrictEqual(resolveLocale("/about", "xx", "es"), {
	action: "redirect",
	pathname: "/es/about",
	setCookie: "es",
});
// Look-alike segments are not locale prefixes
assert.deepStrictEqual(resolveLocale("/france", "ca", null), {
	action: "rewrite",
	pathname: "/ca/france",
});

// hreflang
assert.deepStrictEqual(alternates("fr", "/about"), {
	canonical: "/fr/about",
	languages: {
		ca: "/about",
		es: "/es/about",
		fr: "/fr/about",
		en: "/en/about",
		pt: "/pt/about",
		"x-default": "/about",
	},
});
// Catalan canonicals are exactly today's (see the metadata on main)
assert.equal(alternates("ca", "/").canonical, "/");
assert.equal(alternates("ca", "/services/mobles-a-mesura").canonical, "/services/mobles-a-mesura");

// Page metadata keeps the Open Graph image every page has today
assert.equal(ogLocale("ca"), "ca_AD");
assert.equal(ogLocale("pt"), "pt_PT");
assert.deepStrictEqual(pageMetadata("en", "/privacitat", "Privacy", "How we use data"), {
	title: "Privacy",
	description: "How we use data",
	alternates: alternates("en", "/privacitat"),
	openGraph: {
		title: "Privacy",
		description: "How we use data",
		locale: "en_GB",
		images: [{ url: "/thumbnail.webp", width: 1280, height: 720 }],
	},
});

// Placeholders
assert.equal(fill("Imatge {n} de {title}", { n: 2, title: "Cuina" }), "Imatge 2 de Cuina");
assert.equal(fill("{missing}", {}), "{missing}");

console.log("i18n-config ok");
