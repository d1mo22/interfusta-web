import { getPortfolioData } from "../actions/data";
import AdminDashboard from "./admin-dashboard";

export default async function AdminPage() {
	const { projects, categories } = await getPortfolioData();

	return <AdminDashboard initialProjects={projects} categories={categories} />;
}
