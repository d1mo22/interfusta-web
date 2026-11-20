import type { Metadata } from "next";
import ClientContact from "./client-contact";
import { getDictionary, getLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n-config";

export async function generateMetadata(): Promise<Metadata> {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	return pageMetadata(lang, "/contact", dict.contact.metaTitle, dict.contact.metaDescription);
}

export default async function ContactPage() {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	return (
		<ClientContact
			lang={lang}
			dict={dict.contact}
			schedule={dict.footer.schedule}
			hoursLabel={dict.footer.hours}
		/>
	);
}
