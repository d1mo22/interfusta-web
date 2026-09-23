import { getCategories } from "@/app/actions/data";
import ProjectWizard from "../project-wizard";

export default async function NewProjectPage() {
	return <ProjectWizard categories={await getCategories()} />;
}
