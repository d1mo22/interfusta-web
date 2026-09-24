import type ca from "@/messages/ca.json";

export type ServiceSlug = keyof typeof ca.services.items;

// Language-neutral facts about each service, in display order. The copy
// (title, description, landing-page text) lives in messages/*.json under
// services.items.<slug>. Slugs are Catalan in every language, like /privacitat.
export type Service = {
	slug: ServiceSlug;
	imageUrl: string;
	related: ServiceSlug[];
};

export const services: Service[] = [
	{
		slug: "mobles-a-mesura",
		imageUrl: "/Medida-1.webp",
		related: ["restauracio", "mesuraments-i-planificacio", "lacatge-i-vernissat"],
	},
	{
		slug: "instal-lacio-de-cuines",
		imageUrl: "/Cuina-2.webp",
		related: ["mobles-a-mesura", "disseny-amb-corian", "mesuraments-i-planificacio"],
	},
	{
		slug: "lacatge-i-vernissat",
		imageUrl: "/Laca-1.webp",
		related: ["mobles-a-mesura", "restauracio", "finestres-i-balconeres"],
	},
	{
		slug: "disseny-amb-corian",
		imageUrl: "/Corian.webp",
		related: ["instal-lacio-de-cuines", "mobles-a-mesura", "lacatge-i-vernissat"],
	},
	{
		slug: "estructures-de-fusta",
		imageUrl: "/Estructura-2.webp",
		related: ["finestres-i-balconeres", "mesuraments-i-planificacio", "restauracio"],
	},
	{
		slug: "restauracio",
		imageUrl: "/Reforma-2.webp",
		related: ["lacatge-i-vernissat", "mobles-a-mesura", "mesuraments-i-planificacio"],
	},
	{
		slug: "mesuraments-i-planificacio",
		imageUrl: "/Planificacio-2.webp",
		related: ["mobles-a-mesura", "instal-lacio-de-cuines", "estructures-de-fusta"],
	},
	{
		slug: "finestres-i-balconeres",
		imageUrl: "/Finestra.webp",
		related: ["estructures-de-fusta", "lacatge-i-vernissat", "mesuraments-i-planificacio"],
	},
];

export const findService = (slug: string) => services.find((s) => s.slug === slug);
