/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryModalProps {
	images: string[];
	initialIndex: number;
	isOpen: boolean;
	onClose: () => void;
}

export function ImageGalleryModal({
	images,
	initialIndex,
	isOpen,
	onClose,
}: ImageGalleryModalProps) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	useEffect(() => {
		setCurrentIndex(initialIndex);
	}, [initialIndex]);

	const handlePrevious = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : images.length - 1,
		);
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex < images.length - 1 ? prevIndex + 1 : 0,
		);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "ArrowLeft") {
			handlePrevious();
		} else if (event.key === "ArrowRight") {
			handleNext();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className="max-w-4xl h-[80vh] flex items-center justify-center p-0 "
				onKeyDown={handleKeyDown}
			>
				<DialogTitle className="sr-only">
					Galería de imágenes del proyecto
				</DialogTitle>
				<div className="relative w-full h-full">
					<div className="flex items-center justify-center h-full">
						<Button
							variant="ghost"
							size="icon"
							className="absolute left-2 z-10"
							onClick={handlePrevious}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<img
							src={images[currentIndex] || "/placeholder.svg"}
							alt={`Project img ${currentIndex + 1}`}
							width={1200}
							height={800}
							className="max-w-full max-h-[80vh] object-contain"
						/>
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-2 z-10"
							onClick={handleNext}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
					<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
						{currentIndex + 1} / {images.length}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
