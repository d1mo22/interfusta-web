/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	ChevronRight,
	Paintbrush,
	Ruler,
	Drill,
	CookingPot,
} from "lucide-react";

export default function Home() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center">
				<video
					autoPlay
					muted
					loop
					playsInline
					preload="auto"
					className="absolute inset-0 w-full h-full object-cover"
					poster="/thumbnail.jpg"
				>
					<source src="/video.mp4" type="video/mp4" />
				</video>

				{/* Capa de superposición oscura */}
				<div className="absolute inset-0 bg-black/40" />

				<div className="relative z-10 text-center px-4">
					<h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
						Servicios expertos de carpintería en Andorra
					</h1>
					<p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-lg">
						Creando soluciones de madera hermosas y funcionales para su hogar y
						negocio
					</p>
					<Link href="/portfolio">
						<Button
							size="lg"
							className="bg-amber-800 hover:bg-amber-900 text-lg py-6 px-8"
						>
							Ver Nuestro Trabajo <ChevronRight className="ml-2" />
						</Button>
					</Link>
				</div>
			</section>
			{/* Proyecto Destacado */}
			<section className="py-20 bg-amber-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-center mb-12">
						Proyecto Destacado
					</h2>
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<img
								src="https://placehold.co/800x600"
								alt="Proyecto destacado"
								className="rounded-lg shadow-xl loading-lazy"
							/>
						</div>
						<div>
							<h3 className="text-2xl font-bold mb-4">
								Renovación de Villa de Lujo
							</h3>
							<p className="text-gray-600 mb-6">
								Transformamos completamente esta villa con muebles hechos a
								medida, una cocina personalizada y detalles de madera
								intrincados en todo el lugar. Nuestro equipo trabajó
								estrechamente con el cliente para dar vida a su visión,
								resultando en una impresionante muestra de nuestra artesanía.
							</p>
							<ul className="list-disc list-inside text-gray-600 mb-6">
								<li>Gabinetes de cocina diseñados a medida</li>
								<li>Mesa de comedor y sillas hechas a mano</li>
								<li>Armarios empotrados para todas las habitaciones</li>
								<li>Vigas de techo de madera y paneles de pared</li>
							</ul>
							<Link href="/portfolio">
								<Button variant="outline" size="lg">
									Ver todos los Proyectos
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Resumen de Servicios */}
			<section className="py-20 bg-white ">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-center mb-12">
						Nuestros Servicios
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								title: "Muebles a Medida",
								description:
									"Muebles personalizados diseñados y fabricados según sus especificaciones",
								icon: Drill,
								image: "https://placehold.co/400x400",
							},
							{
								title: "Instalación de Cocinas",
								description:
									"Instalación profesional de gabinetes de cocina y personalización",
								icon: CookingPot,
								image: "https://placehold.co/400x400",
							},
							{
								title: "Lacado y barnizado",
								description:
									"Acabados profesionales para proteger y embellecer sus muebles de madera",
								icon: Paintbrush,
								image: "https://placehold.co/400x400",
							},
							{
								title: "Mediciones y Planificación",
								description:
									"Planificación detallada y mediciones precisas para su proyecto",
								icon: Ruler,
								image: "https://placehold.co/400x400",
							},
						].map((service) => (
							<Card
								key={service.title.toLowerCase().replace(/\s+/g, "-")}
								className="border-none shadow-lg"
							>
								<img
									src={service.image || "https://placehold.co/400x400"}
									alt={service.title}
									className="w-full h-48 object-cover"
								/>
								<CardContent className="pt-6">
									<div className="rounded-full bg-amber-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
										<service.icon className="w-6 h-6 text-amber-800" />
									</div>
									<h3 className="text-xl font-semibold mb-2">
										{service.title}
									</h3>
									<p className="text-gray-600">{service.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
					<div className="text-center mt-12">
						<Link href="/services">
							<Button variant="outline" size="lg">
								Explorar Todos los Servicios
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-20 bg-amber-800 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl font-bold mb-4">
						¿Listo para Comenzar tu Proyecto?
					</h2>
					<p className="text-xl mb-8 max-w-2xl mx-auto">
						Hagamos realidad tu visión. Contáctanos hoy para una consulta y
						presupuesto gratuito.
					</p>
					<Link href="/contact">
						<Button
							size="lg"
							variant="secondary"
							className="bg-white text-amber-800 hover:bg-gray-100"
						>
							Contáctanos
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}
