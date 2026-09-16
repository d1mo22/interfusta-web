import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/reveal";

export const metadata = {
	title: "Sobre nosaltres",
	description:
		"Fusteria InterFusta: més de 10 anys de fusteria artesana a Andorra, amb un equip de 6 persones i més de 250 projectes realitzats.",
	alternates: { canonical: "/about" },
};

const stats = [
	{ label: "Anys d'experiència", value: "10+" },
	{ label: "Projectes realitzats", value: "250+" },
	{ label: "Clients satisfets", value: "100+" },
	{ label: "Membres de l'equip", value: "6" },
];

const values = [
	{
		title: "Artesania de Qualitat",
		description:
			"Ens enorgullim d'oferir una qualitat excepcional en cada projecte, utilitzant els millors materials i tècniques",
	},
	{
		title: "Satisfacció del Client",
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
		<div className="pt-[72px]">
			<section className="pt-16 md:pt-24 pb-20 md:pb-28">
				<div className="container-site grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
					<div className="lg:col-span-5">
						<h1 className="text-4xl md:text-5xl tracking-tight">
							Sobre InterFusta
						</h1>
						<div className="mt-6 space-y-4 text-ink-muted leading-relaxed">
							<p>
								Des de la nostra creació, Interfusta ha estat a
								l&apos;avantguarda dels serveis de fusteria de primera qualitat
								a Andorra. El nostre compromís amb l&apos;excel·lència i
								l&apos;atenció al detall ens ha convertit en un nom de confiança
								en la indústria.
							</p>
							<p>
								Combinem tècniques tradicionals d&apos;ebenisteria amb
								tecnologia moderna per a crear peces sorprenents que superen la
								prova del temps. El nostre equip d&apos;experts artesans aporta
								dècades d&apos;experiència combinada a cada projecte.
							</p>
						</div>
					</div>
					<div className="lg:col-span-7">
						<div className="relative aspect-[4/3]">
							<Image
								src="/About.webp"
								alt="El nostre taller"
								fill
								priority
								className="object-cover"
								sizes="(min-width:1024px) 58vw, 100vw"
							/>
						</div>
					</div>
				</div>
			</section>

			<section>
				<div className="container-site">
					<dl className="hairline-t grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-hairline">
						{stats.map((stat) => (
							<div
								key={stat.label}
								className="py-8 md:py-10 border-b border-hairline md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
							>
								<dd className="font-display text-5xl md:text-6xl tracking-tight text-brand-ink">
									{stat.value}
								</dd>
								<dt className="mt-2 text-sm text-ink-muted">{stat.label}</dt>
							</div>
						))}
					</dl>
				</div>
			</section>

			<section className="py-24 md:py-32">
				<div className="container-site">
					<h2 className="text-3xl md:text-4xl tracking-tight">
						Els nostres Valors
					</h2>
					<Reveal className="mt-10 hairline-t">
						{values.map((value) => (
							<div
								key={value.title}
								className="grid md:grid-cols-12 gap-4 md:gap-8 py-8 border-b border-hairline"
							>
								<h3 className="md:col-span-4 text-2xl tracking-tight">
									{value.title}
								</h3>
								<p className="md:col-span-8 text-ink-muted leading-relaxed max-w-[60ch]">
									{value.description}
								</p>
							</div>
						))}
					</Reveal>
				</div>
			</section>

			<section className="hairline-t py-16">
				<div className="container-site flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<p className="text-xl md:text-2xl tracking-tight max-w-[36ch]">
						Parlem del seu projecte.
					</p>
					<Link href="/contact" className="btn btn-primary">
						Contacta&apos;ns
					</Link>
				</div>
			</section>
		</div>
	);
}
