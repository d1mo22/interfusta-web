/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
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
import featuredProject from "@/data/featured-project.json";
import { ImageGalleryModal } from "@/components/image-gallery-modal";

export default function Home() {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const openGallery = (index: number) => {
		setSelectedImageIndex(index);
		setIsGalleryOpen(true);
	};
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
					poster="/thumbnail.webp"
				>
					<source src="/video.mp4" type="video/mp4" />
				</video>

				{/* Capa de superposición oscura */}
				<div className="absolute inset-0 bg-black/40" />

				<div className="relative z-10 text-center px-4">
					<h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
						Serveis experts de fusteria a Andorra
					</h1>
					<p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-lg">
						Creant solucions de fusta elegants i funcionals per a la seva llar i
						negoci
					</p>
					<Link href="/portfolio">
						<Button
							size="lg"
							className="bg-amber-800 hover:bg-amber-900 text-lg py-6 px-8"
						>
							Veure el Nostre Treball <ChevronRight className="ml-2" />
						</Button>
					</Link>
				</div>
			</section>
			{/* Proyecto Destacado */}
			<section className="py-20 bg-amber-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-center mb-12">
						Projecte Destacat
					</h2>
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<img
								src={featuredProject.image.url}
								alt={featuredProject.image.alt}
								className="rounded-lg shadow-xl loading-lazy"
							/>
						</div>
						<div>
							<h3 className="text-2xl font-bold mb-4">
								{featuredProject.title}
							</h3>
							<p className="text-gray-600 mb-6">
								{featuredProject.description}
							</p>
							<ul className="list-disc list-inside text-gray-600 mb-6">
								{featuredProject.features.map((feature: string) => (
									<li key={feature}>{feature}</li>
								))}
							</ul>

							{/* Añadir miniaturas */}
							<div className="grid grid-cols-4 gap-2 mb-6">
								{featuredProject.gallery.map((image, index) => (
									<button
										type="button"
										key={`thumbnail-${image.alt}`}
										className="overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity"
										onClick={() => openGallery(index)}
									>
										<img
											src={image.url}
											alt={image.alt}
											className="w-full h-20 object-cover transition-transform duration-300 hover:scale-110"
										/>
									</button>
								))}
							</div>

							<Link href="/portfolio">
								<Button variant="outline" size="lg">
									Veure tots els Projectes
								</Button>
							</Link>
						</div>
					</div>
				</div>
				<ImageGalleryModal
					images={featuredProject.gallery.map((img) => img.url)}
					initialIndex={selectedImageIndex}
					isOpen={isGalleryOpen}
					onClose={() => setIsGalleryOpen(false)}
				/>
			</section>

			{/* Resumen de Servicios */}
			<section className="py-20 bg-white ">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-center mb-12">
						Els nostres Serveis
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								title: "Mobles a Mesura",
								description:
									"Mobles personalitzats dissenyats i fabricats segons les seves especificacions",
								icon: Drill,
								image: "/Medida-2.webp",
							},
							{
								title: "Instal·lació de Cuines",
								description:
									"Instal·lació professional de gabinets de cuina i personalització",
								icon: CookingPot,
								image: "/Cuina-2.webp",
							},
							{
								title: "Lacatge i Vernissat",
								description:
									"Acabats professionals per a protegir i embellir els seus mobles de fusta",
								icon: Paintbrush,
								image: "/Laca-1.webp",
							},
							{
								title: "Mesuraments i Planificació",
								description:
									"Planificació detallada i mesuraments precisos per al seu projecte",
								icon: Ruler,
								image: "/Planificacio-1.webp",
							},
						].map((service) => (
							<Card
								key={service.title.toLowerCase().replace(/\s+/g, "-")}
								className="border-none shadow-lg"
							>
								<img
									src={service.image || "https://placehold.co/400x400"}
									alt={service.title}
									className="w-full h-48 object-cover rounded-t-lg"
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
								Explorar Tots els Serveis
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-20 bg-amber-800 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl font-bold mb-4">
						Llest per Començar el teu Projecte?
					</h2>
					<p className="text-xl mb-8 max-w-2xl mx-auto">
						Fem realitat la teva visió. Contacta&apos;ns avui per a una consulta
						i pressupost gratuït.
					</p>
					<Link href="/contact">
						<Button
							size="lg"
							variant="secondary"
							className="bg-white text-amber-800 hover:bg-gray-100"
						>
							Contacta&apos;ns
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}
