"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageGalleryModal } from "@/components/image-gallery-modal";

type GalleryImage = {
	url: string;
	alt: string;
};

export function FeaturedGallery({ images }: { images: GalleryImage[] }) {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const openGallery = (index: number) => {
		setSelectedIndex(index);
		setIsGalleryOpen(true);
	};

	return (
		<>
			<div className="grid grid-cols-4 gap-3 mt-3">
				{images.map((image, index) => (
					<button
						type="button"
						key={image.url}
						onClick={() => openGallery(index)}
						className="relative aspect-square overflow-hidden"
					>
						<Image
							src={image.url}
							alt={`Imatge ${index + 1} del projecte destacat`}
							fill
							sizes="(min-width: 1024px) 15vw, 25vw"
							className="object-cover transition-transform duration-300 hover:scale-[1.02]"
						/>
					</button>
				))}
			</div>
			<ImageGalleryModal
				images={images.map((image) => image.url)}
				initialIndex={selectedIndex}
				isOpen={isGalleryOpen}
				onClose={() => setIsGalleryOpen(false)}
			/>
		</>
	);
}
