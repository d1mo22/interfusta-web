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
							la creació de elegants solucions de fusta.
						</p>
					</div>
					<div className="flex flex-col gap-3">
						<span className="text-ink-muted text-sm">Contacte</span>
						<p className="font-mono text-sm leading-[1.9]">
							interfusta@andorra.ad
							<br />
							+376 804 440
						</p>
						<p className="text-[15px]">
							Passatge d&apos;Enclar S/N
							<br />
							Santa Coloma, AD500, Andorra
						</p>
					</div>
					<div className="flex flex-col gap-3">
						<span className="text-ink-muted text-sm">Horari</span>
						<p className="font-mono text-sm leading-[1.9]">
							Dilluns - Divendres 9:00 - 17:00
							<br />
							Dissabte 10:00 - 13:00
							<br />
							Diumenge tancat
						</p>
					</div>
				</div>
				<div className="border-t border-hairline mt-16 pt-5 text-sm text-ink-muted flex justify-between">
					<span>&copy; {new Date().getFullYear()} Interfusta. Tots els drets reservats.</span>
					<span>Santa Coloma, Andorra</span>
				</div>
			</div>
		</footer>
	);
}
