import Link from "next/link";

const MAPS_URL =
	"https://www.google.com/maps?q=Fusteria+InterFusta+SL&ftid=0x12a5f58f12d8ead7:0x4b992abc827fc509";

export function Footer() {
	return (
		<footer className="bg-stone pt-[72px] pb-10">
			<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
				<div className="grid grid-cols-1 md:grid-cols-[5fr_4fr_3fr] gap-12">
					<div className="flex flex-col gap-5">
						<h3 className="h-display text-[30px]">
							Fusteria <span className="text-brand">InterFusta</span>
						</h3>
						<p className="text-ink-muted text-[15px] max-w-[36ch]">
							Serveis professionals de fusteria amb anys d&apos;experiència en
							la creació d&apos;elegants solucions de fusta.
						</p>
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-mono text-ink-muted text-sm">Contacte</span>
						<p className="font-mono text-sm leading-[1.9]">
							<a
								href="mailto:interfusta@interfusta.ad"
								className="hover:text-ink transition-colors duration-150"
							>
								interfusta@interfusta.ad
							</a>
							<br />
							<a
								href="tel:+376804440"
								className="hover:text-ink transition-colors duration-150"
							>
								+376 804 440
							</a>
						</p>
						<a
							href={MAPS_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="font-mono text-sm hover:text-ink transition-colors duration-150"
						>
							Passatge d&apos;Enclar S/N
							<br />
							Santa Coloma, AD500, Andorra
						</a>
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-mono text-ink-muted text-sm">Horari</span>
						<p className="font-mono text-sm leading-[1.9]">
							Dilluns - Divendres 9:00 - 17:00
							<br />
							Dissabte 10:00 - 13:00
							<br />
							Diumenge tancat
						</p>
					</div>
				</div>
				<div className="border-t border-hairline mt-16 pt-5 font-mono text-sm text-ink-muted flex flex-wrap items-center justify-between gap-4">
					<span>&copy; {new Date().getFullYear()} Fusteria InterFusta. Tots els drets reservats.</span>
					<div className="flex items-center gap-4">
						<Link
							href="/privacitat"
							className="hover:text-ink transition-colors duration-150"
						>
							Política de privacitat
						</Link>
						<span>Santa Coloma, Andorra</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
