import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/reveal";

export const metadata = {
	title: "Serveis de fusteria",
	description:
		"Mobles a mesura, instal·lació de cuines, lacatge i vernissat, disseny amb Corian, estructures de fusta, restauració, mesuraments i finestres a Andorra.",
	alternates: { canonical: "/services" },
};

const services = [
	{
		title: "Mobles a Mesura",
		description:
			"Dissenyem i fabriquem mobles a mesura adaptats a les seves necessitats i preferències específiques. Des d'elegants taules de menjador fins a armaris a mesura, els nostres experts artesans faran realitat la seva visió.",
		imageUrl: "/Medida-1.webp",
	},
	{
		title: "Instal·lació de Cuines",
		description:
			"Transformi la seva cuina amb els nostres serveis professionals d'instal·lació. Ens encarreguem de tot, des del muntatge d'armaris fins a les solucions d'emmagatzematge personalitzades, garantint una funcionalitat i estètica perfectes.",
		imageUrl: "/Cuina-2.webp",
	},
	{
		title: "Lacatge i Vernissat",
		description:
			"Oferim serveis professionals d'acabat per a tota mena de superfícies de fusta. Utilitzem tècniques especialitzades de lacatge i vernissat per a protegir i realçar la bellesa natural dels seus mobles, garantint un acabat durador i elegant.",
		imageUrl: "/Laca-1.webp",
	},
	{
		title: "Disseny amb Corian",
		description:
			"Especialistes en el disseny i fabricació amb Corian, un material versàtil i durador perfecte per a encimeres, lavabos i superfícies decoratives. Creem dissenys únics i funcionals que s'adapten perfectament al seu espai.",
		imageUrl: "/Corian.webp",
	},
	{
		title: "Estructures de Fusta",
		description:
			"Creï impressionants espais a l'aire lliure amb les nostres estructures de fusta. Construïm pèrgoles, cobertes i elements arquitectònics que realcen el valor de la seva propietat.",
		imageUrl: "/Estructura-2.webp",
	},
	{
		title: "Restauració",
		description:
			"Doni una nova vida a les seves preuades peces de fusta amb els nostres serveis de restauració. Reparem i repintem acuradament els mobles conservant el seu caràcter original.",
		imageUrl: "/Reforma-2.webp",
	},
	{
		title: "Mesuraments i Planificació",
		description:
			"El nostre equip d'experts proporciona mesuraments precisos i serveis de planificació detallada per a garantir l'èxit del seu projecte. Tenim en compte tots els detalls abans de començar la construcció.",
		imageUrl: "/Planificacio-2.webp",
	},
	{
		title: "Finestres i balconeres",
		description:
			"Dissenyem i fabriquem finestres i balconeres de fusta a mida, adaptades a les seves necessitats i preferències. Utilitzem fusta de qualitat i tècniques artesanals per a garantir un acabat durador i elegant.",
		imageUrl: "/Finestra.webp",
	},
];

export default function ServicesPage() {
	return (
		<div className="pt-[72px]">
			<section className="pt-16 pb-12 md:pt-24 md:pb-16">
				<div className="container-site">
					<h1 className="text-4xl md:text-5xl tracking-tight">
						Els nostres serveis
					</h1>
					<p className="mt-5 text-lg text-ink-muted max-w-[60ch]">
						Oferim una àmplia gamma de serveis de fusteria, combinant artesania
						tradicional amb tècniques modernes per a resultats excepcionals.
					</p>
				</div>
			</section>

			<section className="pb-24 md:pb-32">
				<div className="container-site">
					<Reveal className="hairline-t pt-12 grid md:grid-cols-2 gap-x-10 gap-y-16 lg:gap-x-16 lg:gap-y-20">
						{services.map((service, index) => {
							const isWide = index === 0 || index === services.length - 1;

							return (
								<article
									key={service.title}
									className={isWide ? "md:col-span-2" : undefined}
								>
									<div
										className={`relative overflow-hidden ${
											isWide ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/3]"
										}`}
									>
										<Image
											src={service.imageUrl}
											alt={service.title}
											fill
											className="object-cover"
											sizes="(min-width:768px) 50vw, 100vw"
										/>
									</div>
									{isWide ? (
										<div className="mt-5 md:grid md:grid-cols-12 md:gap-6 lg:gap-10">
											<h2 className="md:col-span-5 text-2xl tracking-tight">
												{service.title}
											</h2>
											<p className="mt-2 md:mt-0 md:col-span-7 text-ink-muted leading-relaxed">
												{service.description}
											</p>
										</div>
									) : (
										<>
											<h2 className="mt-5 text-2xl tracking-tight">
												{service.title}
											</h2>
											<p className="mt-2 text-ink-muted leading-relaxed">
												{service.description}
											</p>
										</>
									)}
								</article>
							);
						})}
					</Reveal>
				</div>
			</section>

			<section className="hairline-t py-16">
				<div className="container-site flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<p className="text-xl md:text-2xl tracking-tight max-w-[36ch]">
						Té un projecte en ment? Expliqui&apos;ns-el.
					</p>
					<Link href="/contact" className="btn btn-primary">
						Contacta&apos;ns
					</Link>
				</div>
			</section>
		</div>
	);
}
