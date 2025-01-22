import ClientPage from "./client-portfolio";
import { getPortfolioData } from "../actions/data";

export default async function PortfolioPage() {
	// const categories = await getCategories();
	// const projects = await getProjects();

	const { projects, categories } = await getPortfolioData();

	return <ClientPage initialProjects={projects} categories={categories} />;
}
