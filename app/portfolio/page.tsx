import ClientPage from "./client-portfolio";
import { getPortfolioData } from "../actions/data";

export default async function PortfolioPage() {
	const { projects, categories } = await getPortfolioData();

	return <ClientPage initialProjects={projects} categories={categories} />;
}
