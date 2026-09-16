import ClientPage from "./client-portfolio";
import { getPortfolioData } from "../actions/data";

export const metadata = {
	title: "Projectes",
	description:
		"Projectes de fusteria realitzats per InterFusta a Andorra: mobles a mesura, cuines, estructures de fusta i restauracions.",
	alternates: {
		canonical: "/portfolio",
	},
};

export default async function PortfolioPage() {
	const { projects, categories } = await getPortfolioData();

	return <ClientPage initialProjects={projects} categories={categories} />;
}
