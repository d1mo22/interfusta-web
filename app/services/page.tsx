/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";
import {
	Hammer,
	Ruler,
	Drill as Saw,
	CookingPot as Tool,
	Paintbrush,
	Wrench,
} from "lucide-react";

export default function ServicesPage() {
	const services = [
		{
			title: "Muebles a Medida",
			description:
				"Diseñamos y fabricamos muebles a medida adaptados a sus necesidades y preferencias específicas. Desde elegantes mesas de comedor hasta armarios a medida, nuestros expertos artesanos harán realidad su visión.",
			icon: Saw,
			imageUrl: "https://placehold.co/600x400",
		},
		{
			title: "Instalación de cocinas",
			description:
				"Transforme su cocina con nuestros servicios profesionales de instalación. Nos encargamos de todo, desde el montaje de armarios hasta las soluciones de almacenamiento personalizadas, garantizando una funcionalidad y estética perfectas..",
			icon: Tool,
			imageUrl: "https://placehold.co/600x400",
		},
		{
			title: "Lacado y barnizado",
			description:
				"Ofrecemos servicios profesionales de acabado para todo tipo de superficies de madera. Utilizamos técnicas especializadas de lacado y barnizado para proteger y realzar la belleza natural de sus muebles, garantizando un acabado duradero y elegante.",
			icon: Paintbrush,
			imageUrl: "https://placehold.co/600x400",
		},
		{
			title: "Estructuras de madera",
			description:
				"Cree impresionantes espacios al aire libre con nuestras estructuras de madera. Construimos pérgolas, cubiertas y elementos arquitectónicos que realzan la belleza y el valor de su propiedad.",
			icon: Hammer,
			imageUrl: "https://placehold.co/600x400",
		},
		{
			title: "Mediciones y Planificación",
			description:
				"Nuestro equipo de expertos proporciona mediciones precisas y servicios de planificación detallada para garantizar el éxito de su proyecto. Tenemos en cuenta todos los detalles antes de comenzar la construcción.",
			icon: Ruler,
			imageUrl: "https://placehold.co/600x400",
		},
		{
			title: "Restauración",
			description:
				"Dé una nueva vida a sus preciadas piezas de madera con nuestros servicios de restauración. Reparamos y repintamos cuidadosamente los muebles conservando su carácter original.",
			icon: Wrench,
			imageUrl: "https://placehold.co/600x400",
		},
	];

	return (
		<div className="min-h-screen pt-16 bg-amber-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-4xl font-bold text-center mb-4">
					Nuestros Servicios
				</h1>
				<p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
					Ofrecemos una amplia gama de servicios de carpintería, combinando
					artesanía tradicional con técnicas modernas para resultados
					excepcionales.
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
