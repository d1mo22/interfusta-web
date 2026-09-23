import Link from "next/link";
import { Grain } from "@/components/grain";
import { ErrorSheet } from "@/components/error-sheet";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const metadata = {
	title: "Pàgina no trobada",
};

export default function NotFound() {
	// Lives outside the route groups (it catches every unknown URL), so it
	// brings the public chrome itself.
	return (
		<>
			<Navigation />
			<main id="main" className="bg-paper text-ink">
				<Grain />
				<section className="pt-[104px] pb-[120px]">
					<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
						<ErrorSheet
							code="404"
							titleBlock={{
								title: "Plànol no trobat",
								rows: [
									["Full", "404 / —"],
									["Escala", "1:1"],
									["Material", "Roure"],
								],
							}}
						/>
						<div className="grid gap-12 mt-11 items-end lg:grid-cols-[8fr_4fr]">
							<div className="flex flex-col gap-5">
								<h1 className="h-page">Aquesta pàgina no és al plànol</h1>
								<span className="rule" />
							</div>
							<div className="flex flex-col gap-5">
								<p className="text-ink-muted text-[17px] max-w-[44ch] leading-relaxed">
									Potser s&apos;ha mogut o l&apos;enllaç no és correcte.
								</p>
								<div className="flex flex-wrap items-center gap-7 pt-2">
									<Link
										href="/"
										className="btn-press inline-flex h-[54px] items-center px-[30px] bg-brand text-on-dark text-[19px] font-bold rounded-none hover:bg-brand-deep hover:text-on-dark"
									>
										Torna a l&apos;inici
									</Link>
									<Link
										href="/portfolio"
										className="underline decoration-brand decoration-2 underline-offset-[6px] font-medium hover:text-brand-ink"
									>
										Veure projectes
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
