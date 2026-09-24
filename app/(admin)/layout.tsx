import { HtmlShell, baseMetadata } from "@/components/html-shell";

// The admin is its own root layout (the site's lives under app/[lang]) and stays in Catalan.
export const metadata = {
	...baseMetadata,
	title: "Panell | InterFusta",
	robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
	return (
		<HtmlShell lang="ca" skipLabel="Ves al contingut">
			<main id="main" className="min-h-[100dvh] bg-paper text-ink">
				{children}
			</main>
		</HtmlShell>
	);
}
