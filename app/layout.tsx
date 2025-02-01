import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
//import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	//TODO: Change this to the actual URL
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_BASE_URL ||
			"https://interfusta-github-io.vercel.app/",
	),
	title: "Fusteria InterFusta - Serveis experts de fusteria",
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
				url: "/logoDark.ico",
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
		<html lang="ca">
			{/* <head>
				<Script
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
				</Script>
			</head> */}
			<body className={inter.className}>
				<Navigation />
				<main>{children}</main>
				<Analytics />
				<SpeedInsights />
				<Footer />
			</body>
		</html>
	);
}
