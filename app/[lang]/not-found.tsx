import { getDictionary, getLocale } from "@/lib/i18n";
import { NotFoundContent } from "@/components/not-found-content";

export async function generateMetadata() {
	return { title: (await getDictionary()).notFound.metaTitle };
}

export default async function NotFound() {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	return <NotFoundContent lang={lang} dict={dict} />;
}
