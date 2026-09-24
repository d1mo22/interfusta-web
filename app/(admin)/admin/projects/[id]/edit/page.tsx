import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getProjectDetails, getCategories } from "@/app/actions/data";
import { PROJECT_FIELDS, missingFields } from "@/lib/translate";
import ProjectWizard from "../../project-wizard";
import TranslationsEditor from "./translations-editor";
import type { Feature, ImageData } from "@/types/types";

const tabClass = (active: boolean) =>
	active
		? "text-[15px] text-ink underline decoration-brand decoration-2 underline-offset-[7px]"
		: "text-[15px] text-ink-muted hover:text-ink";

// ponytail: the tab lives in the URL (?tab=traduccions) instead of client state, so it's linkable from the dashboard badge
export default async function EditProjectPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ tab?: string }>;
}) {
	const id = Number.parseInt((await params).id);
	if (Number.isNaN(id)) notFound();
	const showTranslations = (await searchParams).tab === "traduccions";

	const [project, categories] = await Promise.all([getProjectDetails(id), getCategories()]);
	if (!project) notFound();

	const features = (project.features ?? []) as Feature[];
	// Same rule as the dashboard's translation_pending: a blank Catalan has
	// nothing to translate, so it never counts as missing.
	const pending =
		missingFields(
			project.translations,
			PROJECT_FIELDS.filter((f) => project[f]?.trim()),
		).length > 0 ||
		features.some(
			(f) =>
				f.description?.trim() && missingFields(f.translations, ["description"]).length > 0,
		);

	return (
		<>
			<nav
				aria-label="Seccions del projecte"
				className="max-w-[1280px] mx-auto px-6 lg:px-20 pt-8 flex gap-8"
			>
				<Link
					href={`/admin/projects/${id}/edit`}
					aria-current={showTranslations ? undefined : "page"}
					className={tabClass(!showTranslations)}
				>
					Projecte
				</Link>
				<Link
					href={`/admin/projects/${id}/edit?tab=traduccions`}
					aria-current={showTranslations ? "page" : undefined}
					className={tabClass(showTranslations)}
				>
					Traduccions
					{pending && <span className="ml-2 font-mono text-[13px] text-brand-ink">pendent</span>}
				</Link>
			</nav>

			{showTranslations ? (
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 pt-10 pb-[120px]">
					<TranslationsEditor
						projectId={id}
						catalan={{
							title: project.title ?? "",
							description: project.description ?? "",
							full_description: project.full_description ?? "",
							duration: project.duration ?? "",
						}}
						features={features.map((f) => ({
							id: f.id,
							description: f.description,
							translations: f.translations ?? null,
						}))}
						initial={project.translations ?? null}
						pending={pending}
					/>
				</div>
			) : (
				<ProjectWizard
					categories={categories}
					initial={{
						id: project.id,
						title: project.title,
						categoryId: project.category_id,
						description: project.description,
						fullDescription: project.full_description,
						completionDate: format(new Date(project.completion_date), "yyyy-MM-dd"),
						duration: project.duration,
						features: features.map((f) => f.description),
						photos: ((project.images ?? []) as ImageData[]).map((i) => ({
							id: i.id,
							url: i.url,
						})),
					}}
				/>
			)}
		</>
	);
}
