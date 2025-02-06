/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";
import {
	Hammer,
	Ruler,
	Drill as Saw,
	CookingPot as Tool,
	Paintbrush,
	Wrench,
	BrickWall,
} from "lucide-react";

export default function ServicesPage() {
	const services = [
		{
			title: "Mobles a Mesura",
			description:
				"Dissenyem i fabriquem mobles a mesura adaptats a les seves necessitats i preferències específiques. Des d'elegants taules de menjador fins a armaris a mesura, els nostres experts artesans faran realitat la seva visió.",
			icon: Saw,
			imageUrl: "/Medida-1.webp",
		},
		{
			title: "Instal·lació de Cuines",
			description:
				"Transformi la seva cuina amb els nostres serveis professionals d'instal·lació. Ens encarreguem de tot, des del muntatge d'armaris fins a les solucions d'emmagatzematge personalitzades, garantint una funcionalitat i estètica perfectes.",
			icon: Tool,
			imageUrl: "/Cuina-2.webp",
		},
		{
			title: "Lacatge i Vernissat",
			description:
				"Oferim serveis professionals d'acabat per a tota mena de superfícies de fusta. Utilitzem tècniques especialitzades de lacatge i vernissat per a protegir i realçar la bellesa natural dels seus mobles, garantint un acabat durador i elegant.",
			icon: Paintbrush,
			imageUrl: "https://placehold.co/600x400",
		},
		{
			title: "Disseny amb Corian",
			description:
				"Especialistes en el disseny i fabricació amb Corian, un material versàtil i durador perfecte per a encimeres, lavabos i superfícies decoratives. Creem dissenys únics i funcionals que s'adapten perfectament al seu espai.",
			icon: BrickWall,
			imageUrl: "/Corian.webp",
		},
		{
			title: "Estructures de Fusta",
			description:
				"Creï impressionants espais a l'aire lliure amb les nostres estructures de fusta. Construïm pèrgoles, cobertes i elements arquitectònics que realcen el valor de la seva propietat.",
			icon: Hammer,
			imageUrl: "/Estructura-2.webp",
		},

		{
			title: "Restauració",
			description:
				"Doni una nova vida a les seves preuades peces de fusta amb els nostres serveis de restauració. Reparem i repintem acuradament els mobles conservant el seu caràcter original.",
			icon: Wrench,
			imageUrl: "/Reforma-2.webp",
		},
		{
			title: "Mesuraments i Planificació",
			description:
				"El nostre equip d'experts proporciona mesuraments precisos i serveis de planificació detallada per a garantir l'èxit del seu projecte. Tenim en compte tots els detalls abans de començar la construcció.",
			icon: Ruler,
			imageUrl: "/Planificacio-2.webp",
		},

		{
			title: "Finestres i balconeres",
			description:
				"Dissenyem i fabriquem finestres i balconeres de fusta a mida, adaptades a les seves necessitats i preferències. Utilitzem fusta de qualitat i tècniques artesanals per a garantir un acabat durador i elegant.",
			icon: Hammer,
			imageUrl: "/Finestra.webp",
		},
	];

	return (
		<div className="min-h-screen pt-16 bg-amber-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-4xl font-bold text-center mb-4">
					Els nostres serveis
				</h1>
				<p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
					Oferim una àmplia gamma de serveis de fusteria, combinant artesania
					tradicional amb tècniques modernes per a resultats excepcionals.
				</p>

				<div className="grid gap-12">
					{services.map((service) => (
						<Card key={service.title} className="overflow-hidden">
							<div className="grid md:grid-cols-2 gap-6">
								<div className="order-2 md:order-1">
									<CardContent className="p-6">
										<div className="rounded-full bg-amber-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
											<service.icon className="w-6 h-6 text-amber-800" />
										</div>
										<h2 className="text-2xl font-bold mb-4">{service.title}</h2>
										<p className="text-gray-600 leading-relaxed">
											{service.description}
										</p>
									</CardContent>
								</div>
								<div className="order-1 md:order-2">
									<img
										src={service.imageUrl}
										alt={service.title}
										className="w-full h-full object-cover aspect-video md:aspect-auto min-h-[300px]"
									/>
								</div>
							</div>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
