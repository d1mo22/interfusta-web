import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/i18n-config";
import type ca from "@/messages/ca.json";

export type Dictionary = typeof ca;

// Typed against the Catalan shape: if a language file misses a key, tsc fails.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
	ca: () => import("@/messages/ca.json").then((m) => m.default),
	es: () => import("@/messages/es.json").then((m) => m.default),
	fr: () => import("@/messages/fr.json").then((m) => m.default),
	en: () => import("@/messages/en.json").then((m) => m.default),
	pt: () => import("@/messages/pt.json").then((m) => m.default),
};

// The [lang] segment above the site's root layout. Server Components only:
// root params aren't available in client components, Server Actions or Route Handlers.
export async function getLocale(): Promise<Locale> {
	const value = await lang();
	if (!hasLocale(value)) notFound();
	return value;
}

export async function getDictionary(): Promise<Dictionary> {
	return dictionaries[await getLocale()]();
}
