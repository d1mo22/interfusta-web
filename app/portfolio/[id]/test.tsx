"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { ImageGalleryModal } from "@/app/components/image-gallery-modal";

// This would typically come from a database or API
const projects = [
	{
		id: "modern-kitchen-renovation",
		title: "Modern Kitchen Renovation",
		category: "kitchens",
		description: "Complete kitchen renovation with custom cabinets and island",
		fullDescription:
			"This modern kitchen renovation project showcases our ability to transform spaces into functional and stylish areas. We designed and installed custom cabinets, a spacious island, and integrated high-end appliances to create a chef's dream kitchen. The use of sleek, minimalist design elements combined with warm wood tones results in a contemporary yet inviting atmosphere.",
		images: [
			"/placeholder.svg?height=600&width=800",
			"/placeholder.svg?height=600&width=800",
			"/placeholder.svg?height=600&width=800",
			"/placeholder.svg?height=600&width=800",
			"/placeholder.svg?height=600&width=800",
			"/placeholder.svg?height=600&width=800",
		],
		features: [
			"Custom-designed cabinetry",
			"Large central island with seating",
			"Integrated appliances",
			"Quartz countertops",
			"Under-cabinet lighting",
			"Hardwood flooring",
		],
		clientTestimonial:
			"Interfusta Andorra transformed our outdated kitchen into a stunning, functional space that has become the heart of our home. Their attention to detail and craftsmanship is unparalleled.",
		completionDate: "June 2022",
		duration: "8 weeks",
	},
	// Add more projects here...
];

export default function ProjectDetails({ params }: { params: { id: string } }) {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const project = projects.find((p) => p.id === params.id);

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
						<ChevronLeft className="mr-2 h-4 w-4" /> Back to Portfolio
					</Button>
				</Link>

				<h1 className="text-4xl font-bold mb-6">{project.title}</h1>

				<div className="grid md:grid-cols-2 gap-8 mb-12">
					<div>
						<Image
							src={project.images[0] || "/placeholder.svg"}
							alt={project.title}
							width={800}
							height={600}
							className="rounded-lg shadow-lg cursor-pointer"
							onClick={() => openGallery(0)}
						/>
					</div>
					<div>
						<h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
						<p className="text-gray-700 mb-6">{project.fullDescription}</p>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="font-semibold mb-2">Category</h3>
								<p className="text-gray-600">{project.category}</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Completion Date</h3>
								<p className="text-gray-600">{project.completionDate}</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Duration</h3>
								<p className="text-gray-600">{project.duration}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mb-12">
					<h2 className="text-2xl font-semibold mb-4">Project Features</h2>
					<ul className="grid md:grid-cols-2 gap-4">
						{project.features.map((feature, index) => (
							<li key={index} className="flex items-center">
								<span className="mr-2 text-amber-600">•</span>
								{feature}
							</li>
						))}
					</ul>
				</div>

				<div className="mb-12">
					<h2 className="text-2xl font-semibold mb-4">Project Gallery</h2>
					<div className="grid md:grid-cols-3 gap-4">
						{project.images.map((image, index) => (
							<Image
								key={index}
								src={image || "/placeholder.svg"}
								alt={`${project.title} - Image ${index + 1}`}
								width={400}
								height={300}
								className="rounded-lg shadow-md cursor-pointer"
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
