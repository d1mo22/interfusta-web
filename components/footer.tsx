import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
	{ href: "/services", label: "Serveis" },
	{ href: "/portfolio", label: "Projectes" },
	{ href: "/about", label: "Sobre Nosaltres" },
	{ href: "/contact", label: "Contacte" },
];

export function Footer() {
	return (
		<footer className="border-t border-hairline bg-paper text-ink py-16">
			<div className="container-site">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
				<div className="lg:col-span-5">
					<Link href="/" className="inline-flex items-center" aria-label="InterFusta">
						<Logo width={130} height={44} className="text-ink" />
					</Link>
					<p className="mt-4 text-ink-muted max-w-sm">
						Serveis professionals de fusteria amb anys d&apos;experiència en la
						creació de elegants solucions de fusta.
					</p>
				</div>

				<div className="lg:col-span-2">
					<h3 className="font-display text-base">Navegació</h3>
					<ul className="mt-4 space-y-2">
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="text-sm text-ink-muted hover:text-ink transition-colors duration-200"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div className="lg:col-span-3">
					<h3 className="font-display text-base">Contacte</h3>
					<div className="mt-4 space-y-2 text-sm text-ink-muted">
						<p>
							<a
								href="mailto:interfusta@andorra.ad"
								className="hover:text-ink transition-colors duration-200"
							>
								interfusta@andorra.ad
							</a>
						</p>
						<p>
							Telèfon:{" "}
							<a
								href="tel:+376804440"
								className="hover:text-ink transition-colors duration-200"
							>
								+376 804 440
							</a>
						</p>
						<p>
							Direcció: Passatge d&apos;Enclar S/N, Santa Coloma, AD500,
							Andorra
						</p>
					</div>
				</div>

				<div className="lg:col-span-2">
					<h3 className="font-display text-base">Horari</h3>
					<div className="mt-4 space-y-2 text-sm text-ink-muted">
						<p>Dilluns - Divendres: 9:00 - 17:00</p>
						<p>Dissabte: 10:00 - 13:00</p>
						<p>Diumenge: Tancat</p>
					</div>
				</div>
			</div>

			<div className="mt-12 pt-6 border-t border-hairline text-sm text-ink-muted">
				<p>
					&copy; {new Date().getFullYear()} Interfusta. Tots els drets
					reservats.
				</p>
			</div>
			</div>
		</footer>
	);
}
