import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
//import GoogleAnalytics from "@/components/google-analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	//TODO: Change this to the actual URL
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_BASE_URL ||
			"https://interfusta-github-io.vercel.app/",
	),
	title: "Fusteria InterFusta - Servicios expertos de carpintería",
	description:
		"Servicios profesionales de carpintería y ebanistería en Andorra",
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
		title: "Fusteria InterFusta - Servicios expertos de carpintería",
		description:
			"Servicios profesionales de carpintería y ebanistería en Andorra",
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
		<html lang="es">
			<body className={inter.className}>
				<Navigation />
				<main>
					{children}
					<SpeedInsights />
					<Analytics />
				</main>
				<Footer />
			</body>
		</html>
	);
}
