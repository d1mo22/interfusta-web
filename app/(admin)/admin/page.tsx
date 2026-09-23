import { getPortfolioData } from "@/app/actions/data";
import AdminDashboard from "./admin-dashboard";

export default async function AdminPage({
	searchParams,
}: {
	searchParams: Promise<{ desat?: string }>;
}) {
	const [{ desat }, { projects, categories }] = await Promise.all([
		searchParams,
		getPortfolioData(),
	]);

	return (
		<AdminDashboard
			// json_agg returns null, not [], on an empty table
			projects={projects ?? []}
			categories={categories ?? []}
			savedId={Number(desat) || undefined}
		/>
	);
}
