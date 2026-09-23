import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ThemeScript } from "@/components/theme-script";
import { bricolage, geistSans, geistMono } from "./fonts";
//import Script from "next/script";

export const metadata = {
	//TODO: Change this to the actual URL
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_BASE_URL ||
			"https://interfusta-github-io.vercel.app/",
	),
	title: {
		default: "Fusteria InterFusta - Serveis experts de fusteria",
		template: "%s | InterFusta",
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
		title: "Fusteria InterFusta - Serveis experts de fusteria",
		description: "Serveis professionals de fusteria i ebenisteria a Andorra",
		images: [
			{
				url: "/thumbnail.webp",
				width: 1280,
				height: 720,
			},
		],
	},
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
				className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable} font-sans`}
			>
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-brand focus:px-4 focus:py-2 focus:text-paper"
				>
					Ves al contingut
				</a>
				<Navigation />
				<main id="main">{children}</main>
				<Analytics />
				<SpeedInsights />
				<Footer />
			</body>
		</html>
	);
}
