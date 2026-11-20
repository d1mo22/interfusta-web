import "@/app/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ThemeScript } from "@/components/theme-script";
import { bricolage, geistSans, geistMono } from "@/app/fonts";
import { OG_IMAGE } from "@/lib/i18n-config";
import { siteUrl } from "@/lib/site";

// Metadata both root layouts share; each adds its own title and description.
export const baseMetadata = {
	metadataBase: new URL(siteUrl),
	icons: {
		icon: [
			{ media: "(prefers-color-scheme: dark)", url: "/logoLight.ico", href: "/logoLight.ico" },
			{ media: "(prefers-color-scheme: light)", url: "/logoDark.ico", href: "/logoDark.ico" },
		],
	},
	openGraph: {
		images: [OG_IMAGE],
	},
};

// The <html> document for both root layouts: app/[lang] (site) and app/(admin).
export function HtmlShell({
	lang,
	skipLabel,
	head,
	children,
}: {
	lang: string;
	skipLabel: string;
	head?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<html
			lang={lang}
			suppressHydrationWarning
			className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable}`}
		>
			{/* eslint-disable-next-line @next/next/no-head-element -- root-layout document, rendered by app/[lang] and app/(admin) */}
			<head>
				<ThemeScript />
				{head}
			</head>
			<body className="font-sans">
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-brand focus:px-4 focus:py-2 focus:text-on-dark-ink"
				>
					{skipLabel}
				</a>
				{children}
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
