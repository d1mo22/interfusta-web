/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ImageGalleryModal } from "@/components/image-gallery-modal";
import { formatDate } from "@/lib/utils";
import type { Project, ImageData, Feature } from "@/types/types";

interface ClientPageProps {
	project: Project;
	images: ImageData[];
	features: Feature[];
	category_name: string;
}

export default function ClientPage({
	project,
	images,
	features,
	category_name,
}: ClientPageProps) {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
							src={images[0].url || "https://placehold.co/800x600"}
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
						<p className="text-gray-700 mb-6">{project.full_description}</p>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="font-semibold mb-2">Categoría</h3>
								<p className="text-gray-600">{category_name}</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Fecha de finalización</h3>
								<p className="text-gray-600">
									{formatDate(project.completion_date)}
								</p>
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
						{features.map((feature) => (
							<li key={`feature-${feature.id}`} className="flex items-center">
								<span className="mr-2 text-amber-600">•</span>
								{feature.description}
							</li>
						))}
					</ul>
				</div>

				<div className="mb-12">
					<h2 className="text-2xl font-semibold mb-4">Galería del Proyecto</h2>
					<div className="grid md:grid-cols-3 gap-4">
						{images.slice(1).map((image, index) => (
							<div
								key={`${project.id}-image-${index}`}
								className="overflow-hidden rounded-lg shadow-md"
							>
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<img
									key={`${project.id}-image-${index}`}
									src={image.url || "/placeholder.svg"}
									alt={`${project.title} - img ${index + 1}`}
									width={400}
									height={300}
									className="rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110"
									onClick={() => openGallery(index)}
								/>
							</div>
						))}
					</div>
				</div>

				<ImageGalleryModal
					images={images.slice(1).map((image: ImageData) => image.url)}
					initialIndex={selectedImageIndex}
					isOpen={isGalleryOpen}
					onClose={() => setIsGalleryOpen(false)}
				/>
			</div>
		</div>
	);
}
