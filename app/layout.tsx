import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeScript } from "@/components/theme-script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
//import Script from "next/script";

const display = Bricolage_Grotesque({
	subsets: ["latin", "latin-ext"],
	axes: ["opsz", "wdth"],
	variable: "--font-bricolage",
	display: "swap",
});

const sans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	display: "swap",
});

const mono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://interfustaandorra.com";

export const metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "Fusteria InterFusta - Serveis experts de fusteria",
		template: "%s | Fusteria InterFusta",
	},
	description: "Serveis professionals de fusteria i ebenisteria a Andorra",
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
		type: "website",
		locale: "ca_AD",
		siteName: "Fusteria InterFusta",
		title: "Fusteria InterFusta - Serveis experts de fusteria",
		description: "Serveis professionals de fusteria i ebenisteria a Andorra",
		images: [
			{
				url: "/thumbnail.webp",
				width: 1280,
				height: 720,
				alt: "Taller de fusteria InterFusta",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
	},
	robots: {
		index: true,
		follow: true,
	},
	alternates: {
		canonical: "/",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "HomeAndConstructionBusiness",
	name: "Fusteria InterFusta",
	url: baseUrl,
	logo: `${baseUrl}/InterFusta-logo.svg`,
	image: `${baseUrl}/thumbnail.webp`,
	email: "interfusta@andorra.ad",
	telephone: "+376 804 440",
	address: {
		"@type": "PostalAddress",
		streetAddress: "Passatge d'Enclar S/N",
		addressLocality: "Santa Coloma",
		postalCode: "AD500",
		addressCountry: "AD",
	},
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
			dayOfWeek: ["Saturday"],
			opens: "10:00",
			closes: "13:00",
		},
	],
	areaServed: "Andorra",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ca" suppressHydrationWarning>
			<head>
				<ThemeScript />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				{/* <Script
					src="https://www.googletagmanager.com/gtag/js?id=G-Q7C8FRW87N"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-Q7C8FRW87N');
				`}
				</Script> */}
			</head>
			<body
				className={`${display.variable} ${sans.variable} ${mono.variable} font-sans`}
				suppressHydrationWarning
			>
				<Navigation />
				<main>{children}</main>
				<Analytics />
				<SpeedInsights />
				<Footer />
			</body>
		</html>
	);
}
