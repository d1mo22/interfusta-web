import { getCategories } from "@/app/actions/data";
import CategoryManagement from "./client-categories";

export default async function CategoriesPage() {
	const initialCategories = await getCategories();

	return <CategoryManagement initialCategories={initialCategories} />;
}
