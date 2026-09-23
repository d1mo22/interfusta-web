import Image from "next/image";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";

export const metadata = {
	title: "Sobre Nosaltres",
	description:
		"Coneix l'equip i la trajectòria de Fusteria InterFusta, especialistes en fusteria i ebenisteria a Andorra.",
};

const stats = [
	{ label: "Anys d'experiència", value: "10+" },
	{ label: "Projectes realitzats", value: "250+" },
	{ label: "Clients satisfets", value: "100+" },
	{ label: "Membres de l'equip", value: "6" },
];

const values = [
	{
		title: "Artesania de qualitat",
		description:
			"Ens enorgullim d'oferir una qualitat excepcional en cada projecte, utilitzant els millors materials i tècniques",
	},
	{
		title: "Satisfacció del client",
		description:
			"La teva satisfacció és la nostra prioritat. Treballem estretament amb tu per a assegurar que la teva visió es faci realitat.",
	},
	{
		title: "Sostenibilitat",
		description:
			"Estem compromesos amb pràctiques sostenibles, utilitzant materials d'origen responsable i minimitzant els residus.",
	},
];

export default function AboutPage() {
	return (
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading
						title={
							<>
								Sobre <span className="text-brand">InterFusta</span>
							</>
						}
					/>
				</div>
			</section>

			<section className="pb-28">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid lg:grid-cols-[7fr_5fr] gap-16 items-start">
					<div className="flex flex-col gap-6 text-ink-muted text-lg max-w-[60ch]">
						<p className="text-xl text-ink">
							Des de la nostra creació, Interfusta ha estat a l&apos;avantguarda
							dels serveis de fusteria de primera qualitat a Andorra. El nostre
							compromís amb l&apos;excel·lència i l&apos;atenció al detall ens
							ha convertit en un nom de confiança en la indústria.
						</p>
						<p>
							Combinem tècniques tradicionals d&apos;ebenisteria amb tecnologia
							moderna per a crear peces sorprenents que superen la prova del
							temps. El nostre equip d&apos;experts artesans aporta dècades
							d&apos;experiència combinada a cada projecte.
						</p>
					</div>
					<div className="relative aspect-[4/3] w-full">
						<Image
							src="/About.webp"
							alt="El nostre taller"
							fill
							className="object-cover"
							sizes="(min-width: 1024px) 42vw, 100vw"
						/>
					</div>
				</div>
			</section>

			<section className="bg-stone py-24">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:divide-x divide-hairline">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="px-8 lg:first:pl-0 flex flex-col gap-3"
						>
							<span className="font-display font-semibold text-[72px] leading-none tracking-[-0.03em] text-brand [font-variation-settings:'wdth'_80]">
								{stat.value}
							</span>
							<span className="text-ink-muted text-[15px]">{stat.label}</span>
						</div>
					))}
				</div>
			</section>

			<section className="pt-28 pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col gap-6">
					<h2 className="h-page text-[80px]">
						Els nostres <span className="text-brand">valors</span>
					</h2>
					<span className="rule" />
					<div className="flex flex-col border-b border-hairline">
						{values.map((value, index) => (
							<div
								key={value.title}
								className="grid lg:grid-cols-[80px_5fr_6fr] gap-4 lg:gap-16 py-10 border-t border-hairline items-start"
							>
								<span className="font-mono text-[13px] tracking-[.02em] font-medium text-brand-ink">
									{String(index + 1).padStart(2, "0")}
								</span>
								<h3 className="h-display text-[30px]">{value.title}</h3>
								<p className="text-ink-muted max-w-[50ch]">
									{value.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
