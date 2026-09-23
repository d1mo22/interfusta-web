import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navigation />
			<main id="main">{children}</main>
			<Footer />
		</>
	);
}
