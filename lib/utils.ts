import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatDate = (date: string) => {
	if (!date) return "";
	const d = new Date(date);
	return d.toLocaleDateString("ca-ES", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Scales down to fit MAX_EDGE (never crops, never upscales) and re-encodes as
// WebP (JPEG on Safari), so a 12 MB phone photo uploads as a few hundred KB.
const MAX_EDGE = 1920;

export async function optimizeImage(file: File): Promise<Blob> {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.round(bitmap.width * scale);
	canvas.height = Math.round(bitmap.height * scale);
	canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();

	const encode = (type: string, quality: number) =>
		new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
	// Safari can't encode WebP and silently hands back a PNG; use JPEG there.
	const webp = await encode("image/webp", 0.82);
	const blob = webp?.type === "image/webp" ? webp : await encode("image/jpeg", 0.85);
	if (!blob) throw new Error("No s'ha pogut processar la foto");
	return blob;
}
