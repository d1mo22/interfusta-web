import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ThemeScript } from "@/components/theme-script";
import { bricolage, geistSans, geistMono } from "./fonts";

const siteUrl = (
	process.env.NEXT_PUBLIC_BASE_URL || "https://www.interfustaandorra.com/"
).replace(/\/$/, "");

const description = "Serveis professionals de fusteria i ebenisteria a Andorra";

export const metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Fusteria InterFusta - Serveis experts de fusteria",
		template: "%s | InterFusta",
	},
	description,
	icons: {
		icon: [
			{
				media: "(prefers-color-scheme: dark)",
				url: "/logoLight.ico",
				href: "/logoLight.ico",
			},
			{
				media: "(prefers-color-scheme: light)",
				url: "/logoDark.ico",
				href: "/logoDark.ico",
			},
		],
	},
	openGraph: {
		title: "Fusteria InterFusta - Serveis experts de fusteria",
		description,
		images: [
			{
				url: "/thumbnail.webp",
				width: 1280,
				height: 720,
			},
		],
	},
};

const jsonLd = {
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
					dayOfWeek: [
						"Monday",
						"Tuesday",
						"Wednesday",
						"Thursday",
						"Friday",
					],
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
			url: siteUrl,
			name: "Fusteria InterFusta",
			publisher: { "@id": `${siteUrl}/#business` },
			inLanguage: "ca-AD",
		},
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="ca"
			suppressHydrationWarning
			className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable}`}
		>
			<head>
				<ThemeScript />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
					}}
				/>
			</head>
			<body className="font-sans">
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-brand focus:px-4 focus:py-2 focus:text-on-dark-ink"
				>
					Ves al contingut
				</a>
				{/* Each route group, (site) and (admin), brings its own chrome and <main id="main">. */}
				{children}
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
