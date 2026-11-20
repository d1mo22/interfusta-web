import type { Metadata } from "next";
import Home from "./home-client";
import { getDictionary, getLocale } from "@/lib/i18n";
import { alternates } from "@/lib/i18n-config";

// Title, description and Open Graph come from the layout; the page adds its
// canonical (still "/" for Catalan) and the hreflang links.
export async function generateMetadata(): Promise<Metadata> {
	return { alternates: alternates(await getLocale(), "/") };
}

export default async function Page() {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	return <Home lang={lang} dict={dict.home} galleryDict={dict.gallery} />;
}
