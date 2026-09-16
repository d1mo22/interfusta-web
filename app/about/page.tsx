import Image from "next/image";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";

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
						intro="Des de la nostra creació, Interfusta ha estat a l'avantguarda dels serveis de fusteria de primera qualitat a Andorra. El nostre compromís amb l'excel·lència i l'atenció al detall ens ha convertit en un nom de confiança en la indústria."
					/>
				</div>
			</section>

			<section className="pb-28">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid lg:grid-cols-[7fr_5fr] gap-16 items-start">
					<p className="text-ink-muted text-xl">
						Combinem tècniques tradicionals d&apos;ebenisteria amb tecnologia
						moderna per a crear peces sorprenents que superen la prova del
						temps. El nostre equip d&apos;experts artesans aporta dècades
						d&apos;experiència combinada a cada projecte.
					</p>
					<div className="relative aspect-[4/5] w-full">
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
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid grid-cols-2 lg:grid-cols-4 divide-x divide-hairline">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="px-8 first:pl-0 flex flex-col gap-3"
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
					<div className="grid lg:grid-cols-3 gap-16 pt-16">
						{values.map((value) => (
							<div key={value.title} className="flex flex-col gap-4">
								<h3 className="h-display text-[30px]">{value.title}</h3>
								<p className="text-ink-muted">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
