import ClientPage from "./client-portfolio";
import { getPortfolioData } from "@/app/actions/data";

export const metadata = {
	title: "Projectes",
	description:
		"Explora la nostra col·lecció de projectes de fusteria acabats a Andorra: cuines, mobles a mida, reformes i molt més.",
	alternates: {
		canonical: "/portfolio",
	},
	openGraph: {
		title: "Projectes",
		description:
			"Explora la nostra col·lecció de projectes de fusteria acabats a Andorra: cuines, mobles a mida, reformes i molt més.",
		images: [
			{
				url: "/thumbnail.webp",
				width: 1280,
				height: 720,
			},
		],
	},
};

export default async function PortfolioPage() {
	const { projects, categories } = await getPortfolioData();

	return <ClientPage initialProjects={projects} categories={categories} />;
}
