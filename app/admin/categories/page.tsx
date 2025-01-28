import { getCategories } from "@/app/actions/data";
import CategoryManagement from "./client-categories";

export default async function CategoriesPage() {
	const initialCategories = await getCategories();
	console.log(initialCategories);

	return <CategoryManagement initialCategories={initialCategories} />;
}
