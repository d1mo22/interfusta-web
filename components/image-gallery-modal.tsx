"use client";

import { useState } from "react";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { fill } from "@/lib/i18n-config";

interface ImageGalleryModalProps {
	images: string[];
	initialIndex: number;
	isOpen: boolean;
	onClose: () => void;
	dict: Dictionary["gallery"];
}

export function ImageGalleryModal({
	images,
	initialIndex,
	isOpen,
	onClose,
	dict,
}: ImageGalleryModalProps) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
	if (initialIndex !== prevInitialIndex) {
		setPrevInitialIndex(initialIndex);
		setCurrentIndex(initialIndex);
	}

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
				<DialogTitle className="sr-only">{dict.title}</DialogTitle>
				<DialogDescription className="sr-only">
					{dict.description}
				</DialogDescription>
				<div className="relative w-full h-full">
					<div className="flex items-center justify-center h-full">
						<Button
							variant="ghost"
							size="icon"
							className="absolute left-2 z-10"
							onClick={handlePrevious}
							aria-label={dict.previous}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Image
							src={images[currentIndex] || "/placeholder.svg"}
							alt={fill(dict.imageAlt, { n: currentIndex + 1 })}
							width={1200}
							height={800}
							sizes="(min-width: 1024px) 900px, 100vw"
							className="max-w-full max-h-[80vh] object-contain"
						/>
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-2 z-10"
							onClick={handleNext}
							aria-label={dict.next}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
					<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-on-dark bg-night/90 px-2 py-1 rounded-none">
						{currentIndex + 1} / {images.length}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
