import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatDate = (date: string) => {
	if (!date) return "";
	const d = new Date(date);
	return d.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function optimizeImage(file: File): Promise<Blob> {
	const url = URL.createObjectURL(file);
	const img = new Image();
	img.src = url;

	await new Promise((resolve) => {
		img.onload = resolve;
	});

	const canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
	const ctx = canvas.getContext("2d");

	// Calcular proporciones
	const scale = Math.max(800 / img.width, 600 / img.height);
	const scaledWidth = img.width * scale;
	const scaledHeight = img.height * scale;

	// Centrar imagen
	const x = (800 - scaledWidth) / 2;
	const y = (600 - scaledHeight) / 2;

	// Fondo blanco
	if (ctx) {
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, 800, 600);
		ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
	}

	URL.revokeObjectURL(url);

	return new Promise((resolve) => {
		canvas.toBlob((blob) => resolve(blob as Blob), "image/webp", 0.8);
	});
}
