/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ImageGalleryModal } from "@/components/image-gallery-modal";
import { Grain } from "@/components/grain";
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
		setSelectedImageIndex(index + 1);
		setIsGalleryOpen(true);
	};

	return (
		<div className="bg-paper text-ink">
			<Grain />
			<section className="pt-[104px] pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col gap-12">
					<Link
						href="/portfolio"
						className="inline-flex items-center gap-2 text-[15px] text-ink-muted hover:text-ink w-fit"
					>
						<ChevronLeft className="size-4" /> Torna als projectes
					</Link>

					<h1 className="h-page">{project.title}</h1>

					<div className="grid grid-cols-3 gap-8 border-y border-hairline py-5">
						<div className="flex flex-col gap-2">
							<span className="font-mono text-sm text-ink-muted">
								Categoria
							</span>
							<span className="font-mono">{category_name}</span>
						</div>
						<div className="flex flex-col gap-2">
							<span className="font-mono text-sm text-ink-muted">
								Data de finalització
							</span>
							<span className="font-mono">
								{formatDate(project.completion_date)}
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<span className="font-mono text-sm text-ink-muted">Durada</span>
							<span className="font-mono">{project.duration}</span>
						</div>
					</div>

					{images[0]?.url && (
						<div className="relative aspect-3/2 w-full overflow-hidden">
							<img
								src={images[0].url}
								alt={project.title}
								className="w-full h-full object-cover"
							/>
						</div>
					)}

					<p className="text-ink-muted max-w-[65ch]">
						{project.full_description}
					</p>

					<ul className="border-b border-hairline">
						{features.map((feature) => (
							<li
								key={`feature-${feature.id}`}
								className="py-3.5 border-t border-hairline"
							>
								{feature.description}
							</li>
						))}
					</ul>

					<div className="grid md:grid-cols-3 gap-6">
						{images.slice(1).map((image, index) => (
							<div
								key={`${project.id}-image-${index}`}
								className="overflow-hidden"
							>
								<button
									type="button"
									onClick={() => openGallery(index)}
									aria-label={`Obre la imatge ${index + 1} de ${project.title}`}
									className="block w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
								>
									<img
										src={image.url || "/placeholder.svg"}
										alt={`${project.title} - img ${index + 1}`}
										className="w-full aspect-4/5 object-cover md:[@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02] transition-transform duration-400 ease-out"
									/>
								</button>
							</div>
						))}
					</div>

					<ImageGalleryModal
						images={images.map((image: ImageData) => image.url)}
						initialIndex={selectedImageIndex}
						isOpen={isGalleryOpen}
						onClose={() => setIsGalleryOpen(false)}
					/>
				</div>
			</section>
		</div>
	);
}
