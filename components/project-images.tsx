/* eslint-disable @next/next/no-img-element */
import { useImageUrl } from "@/app/hooks/useImageUrl";
import { Skeleton } from "./ui/skeleton";

export function ProjectImage({
	fileName,
	altText,
}: { fileName: string; altText: string }) {
	const { imageUrl, loading, error } = useImageUrl(fileName);

	if (loading) {
		return (
			<div className="relative h-64">
				{" "}
				{/* Mismo tamaño que el contenedor padre */}
				<Skeleton className="absolute inset-0 rounded-md" />
			</div>
		);
	}
	if (error) return <div>Error: {error}</div>;
	//console.log("URL de la imagen:", imageUrl);
	return (
		<img
			src={imageUrl || "/placeholder.jpg"}
			alt={altText || "Imagen del proyecto"}
			className="w-full h-full object-cover"
		/>
	);
}
