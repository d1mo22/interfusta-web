import type { Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/i18n";
import type { FieldTranslations, ProjectField } from "@/lib/translate";

export interface Project {
	id: number;
	title: string;
	description: string;
	full_description: string;
	completion_date: string;
	duration: string;
	category_id: number;
	first_image: {
		url: string;
		alt_text: string;
	};
	last_update?: string;
	updated_by?: string;
	images?: ImageData[];
	translations?: FieldTranslations<ProjectField> | null;
	translation_pending?: boolean;
}

export interface User {
	id: number;
	name: string;
	email: string;
	password: string; //bcrypt
}

export interface Category {
	id: number;
	name: string;
	is_all?: boolean;
}

export interface Feature {
	id: number;
	project_id: number;
	description: string;
	translations?: FieldTranslations<"description"> | null;
}

export interface ImageData {
	id: number;
	project_id: number;
	url: string;
	alt_text: string;
	order: number;
}

export interface ProjectDetails {
	category_name: string;
	fearures: Feature[];
	images: ImageData[];
}

export interface ClientPortfolioProps {
	initialProjects: Project[];
	categories: Category[];
	lang: Locale;
	dict: Dictionary["portfolio"];
}
