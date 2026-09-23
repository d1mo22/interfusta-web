import { getPortfolioData } from "@/app/actions/data";
import AdminDashboard from "./admin-dashboard";

export default async function AdminPage({
	searchParams,
}: {
	searchParams: { desat?: string };
}) {
	const { projects, categories } = await getPortfolioData();

	return (
		<AdminDashboard
			// json_agg returns null, not [], on an empty table
			projects={projects ?? []}
			categories={categories ?? []}
			savedId={Number(searchParams.desat) || undefined}
		/>
	);
}
