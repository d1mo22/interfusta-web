import type { Metadata } from "next";
import ClientPage from "./client-portfolio";
import { getPortfolioData } from "@/app/actions/data";
import { getDictionary, getLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n-config";

export async function generateMetadata(): Promise<Metadata> {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	return pageMetadata(lang, "/portfolio", dict.portfolio.metaTitle, dict.portfolio.metaDescription);
}

export default async function PortfolioPage() {
	const [lang, dict, { projects, categories }] = await Promise.all([
		getLocale(),
		getDictionary(),
		getPortfolioData(),
	]);
	return (
		<ClientPage initialProjects={projects} categories={categories} lang={lang} dict={dict.portfolio} />
	);
}
