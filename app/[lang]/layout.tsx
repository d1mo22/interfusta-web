import type { Metadata } from "next";
import { HtmlShell, baseMetadata } from "@/components/html-shell";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ErrorStringsProvider } from "@/components/error-strings";
import { getDictionary, getLocale } from "@/lib/i18n";
import { intlLocale, localeHref, locales, ogLocale, type Locale } from "@/lib/i18n-config";
import { absoluteUrl, siteUrl } from "@/lib/site";

export function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	return {
		...baseMetadata,
		title: { default: dict.meta.title, template: "%s | InterFusta" },
		description: dict.meta.description,
		openGraph: {
			...baseMetadata.openGraph,
			title: dict.meta.title,
			description: dict.meta.description,
			locale: ogLocale(lang),
		},
	};
}

// Structured data for search engines (moved from the old app/layout.tsx).
function jsonLd(lang: Locale, description: string) {
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "HomeAndConstructionBusiness",
				"@id": `${siteUrl}/#business`,
				name: "Fusteria InterFusta",
				url: siteUrl,
				description,
				telephone: "+376 804 440",
				email: "interfusta@interfusta.ad",
				image: `${siteUrl}/thumbnail.webp`,
				address: {
					"@type": "PostalAddress",
					streetAddress: "Passatge d'Enclar S/N",
					addressLocality: "Santa Coloma",
					postalCode: "AD500",
					addressCountry: "AD",
				},
				areaServed: {
					"@type": "Country",
					name: "Andorra",
				},
				sameAs: [
					"https://www.google.com/maps?q=Fusteria+InterFusta+SL&ftid=0x12a5f58f12d8ead7:0x4b992abc827fc509",
					"https://www.facebook.com/100054643710483/",
					"https://www.instagram.com/fusteria.interfusta/",
				],
				openingHoursSpecification: [
					{
						"@type": "OpeningHoursSpecification",
						dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
						opens: "09:00",
						closes: "17:00",
					},
					{
						"@type": "OpeningHoursSpecification",
						dayOfWeek: "Saturday",
						opens: "10:00",
						closes: "13:00",
					},
				],
			},
			{
				"@type": "WebSite",
				"@id": `${siteUrl}/#website`,
				url: absoluteUrl(localeHref(lang, "/")),
				name: "Fusteria InterFusta",
				publisher: { "@id": `${siteUrl}/#business` },
				inLanguage: intlLocale[lang],
			},
		],
	};
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	return (
		<HtmlShell
			lang={lang}
			skipLabel={dict.skipLink}
			head={
				<script
					type="application/ld+json"
					// The content comes from our own message files, not user input; "<" is escaped anyway.
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(jsonLd(lang, dict.meta.description)).replace(/</g, "\\u003c"),
					}}
				/>
			}
		>
			<Navigation lang={lang} dict={dict.nav} />
			<ErrorStringsProvider value={{ ...dict.error, sheet: dict.errorSheet, lang }}>
				<main id="main">{children}</main>
			</ErrorStringsProvider>
			<Footer />
		</HtmlShell>
	);
}
