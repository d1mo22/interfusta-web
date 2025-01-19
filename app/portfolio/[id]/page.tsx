"use client";

import { useState, use } from "react";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ImageGalleryModal } from "@/components/image-gallery-modal";

// This would typically come from a database or API
const projects = [
	{
		id: "modern-kitchen-renovation",
		title: "Renovación de una cocina moderna",
		category: "Cocinas",
		description:
			"Renovación completa de la cocina con armarios a medida e isla",
		fullDescription:
			"Este moderno proyecto de renovación de una cocina muestra nuestra capacidad para transformar espacios en zonas funcionales y con estilo. Diseñamos e instalamos armarios a medida, una espaciosa isla e integramos electrodomésticos de alta gama para crear la cocina de ensueño de un chef. El uso de elementos de diseño elegantes y minimalistas combinados con tonos cálidos de madera da como resultado un ambiente contemporáneo pero acogedor.",
		images: [
			"https://placehold.co/800x600",
			"https://placehold.co/800x600",
			"https://placehold.co/800x600",
		],
		features: [
			"Armarios diseñados a medida",
			"Gran isla central con asientos",
			"Electrodomésticos integrados",
			"Encimeras de cuarzo",
			"Iluminación bajo armarios",
			"Suelos de madera",
		],
		completionDate: "Junio 2022",
		duration: "8 semanas",
	},
	// Add more projects here...
];

export default function ProjectDetails({
	params,
}: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const project = projects.find((p) => p.id === resolvedParams.id);

	if (!project) {
		notFound();
	}

	const openGallery = (index: number) => {
		setSelectedImageIndex(index);
		setIsGalleryOpen(true);
	};

	return (
		<div className="min-h-screen pt-16 bg-amber-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<Link href="/portfolio">
					<Button variant="ghost" className="mb-6">
						<ChevronLeft className="mr-2 h-4 w-4" /> Volver a los Proyectos
					</Button>
				</Link>

				<h1 className="text-4xl font-bold mb-6">{project.title}</h1>

				<div className="grid md:grid-cols-2 gap-8 mb-12">
					<div>
						<img
							src={project.images[0] || "https://placehold.co/800x600"}
							alt={project.title}
							width={800}
							height={600}
							className="rounded-lg shadow-lg"
						/>
					</div>
					<div>
						<h2 className="text-2xl font-semibold mb-4">
							Resumen del Proyecto
						</h2>
						<p className="text-gray-700 mb-6">{project.fullDescription}</p>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="font-semibold mb-2">Categoría</h3>
								<p className="text-gray-600">{project.category}</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Fecha de finalización</h3>
								<p className="text-gray-600">{project.completionDate}</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Duración</h3>
								<p className="text-gray-600">{project.duration}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mb-12">
					<h2 className="text-2xl font-semibold mb-4">
						Características del Proyecto
					</h2>
					<ul className="grid md:grid-cols-2 gap-4">
						{project.features.map((feature) => (
							<li key={`feature-${feature}`} className="flex items-center">
								<span className="mr-2 text-amber-600">•</span>
								{feature}
							</li>
						))}
					</ul>
				</div>

				<div className="mb-12">
					<h2 className="text-2xl font-semibold mb-4">Galería del Proyecto</h2>
					<div className="grid md:grid-cols-3 gap-4">
						{project.images.map((image, index) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<img
								key={`${project.id}-image-${index}`}
								src={image || "/placeholder.svg"}
								alt={`${project.title} - img ${index + 1}`}
								width={400}
								height={300}
								className="rounded-lg shadow-md cursor-pointer hover:scale-105 transform transition-transform"
								onClick={() => openGallery(index)}
							/>
						))}
					</div>
				</div>

				<ImageGalleryModal
					images={project.images}
					initialIndex={selectedImageIndex}
					isOpen={isGalleryOpen}
					onClose={() => setIsGalleryOpen(false)}
				/>
			</div>
		</div>
	);
}
