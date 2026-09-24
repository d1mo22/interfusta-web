export const metadata = {
	title: "Contacte",
	description:
		"Contacta amb Fusteria InterFusta a Santa Coloma, Andorra. Demana pressupost per al teu projecte de fusteria.",
	alternates: {
		canonical: "/contact",
	},
	openGraph: {
		title: "Contacte",
		description:
			"Contacta amb Fusteria InterFusta a Santa Coloma, Andorra. Demana pressupost per al teu projecte de fusteria.",
		images: [
			{
				url: "/thumbnail.webp",
				width: 1280,
				height: 720,
			},
		],
	},
};

export default function ContactLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
