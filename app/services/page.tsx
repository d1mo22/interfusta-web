import Image from "next/image";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";

const services = [
	{
		title: "Mobles a mesura",
		description:
			"Dissenyem i fabriquem mobles a mesura adaptats a les seves necessitats i preferències específiques. Des d'elegants taules de menjador fins a armaris a mesura, els nostres experts artesans faran realitat la seva visió.",
		imageUrl: "/Medida-1.webp",
	},
	{
		title: "Instal·lació de cuines",
		description:
			"Transformi la seva cuina amb els nostres serveis professionals d'instal·lació. Ens encarreguem de tot, des del muntatge d'armaris fins a les solucions d'emmagatzematge personalitzades, garantint una funcionalitat i estètica perfectes.",
		imageUrl: "/Cuina-2.webp",
	},
	{
		title: "Lacatge i vernissat",
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
		title: "Estructures de fusta",
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
		title: "Mesuraments i planificació",
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
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading
						title={
							<>
								Els nostres <span className="text-brand">serveis</span>
							</>
						}
						intro="Oferim una àmplia gamma de serveis de fusteria, combinant artesania tradicional amb tècniques modernes per a resultats excepcionals."
					/>
				</div>
			</section>

			<section className="relative h-[560px] overflow-hidden">
				<Image
					src="/Cuina-2.webp"
					alt="Cuina a mida amb illa de fusta"
					fill
					className="object-cover"
					sizes="100vw"
				/>
			</section>

			<section className="pt-28 pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col">
					{services.map((service) => (
						<article
							key={service.title}
							className="grid lg:grid-cols-[5fr_4fr_3fr] gap-8 lg:gap-16 items-start border-t border-hairline first:border-t-0 pt-10 pb-12 first:pt-0"
						>
							<h2 className="h-display text-[44px] max-w-[14ch]">
								{service.title}
							</h2>
							<p className="text-ink-muted pt-2.5">{service.description}</p>
							<div className="relative aspect-[4/3] w-full">
								<Image
									src={service.imageUrl}
									alt={service.title}
									fill
									className="object-cover"
									sizes="(min-width: 1024px) 25vw, 100vw"
								/>
							</div>
						</article>
					))}
				</div>
			</section>
		</div>
	);
}
