import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ThemeScript } from "@/components/theme-script";
import { bricolage, geistSans, geistMono } from "./fonts";

export const metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_BASE_URL || "https://www.interfustaandorra.com/",
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
			</head>
			<body
				className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable} font-sans`}
			>
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
