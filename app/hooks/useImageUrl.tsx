import { useState, useEffect } from "react";

export function useImageUrl(fileName: string) {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!fileName) {
			setError("Nombre de archivo no proporcionado");
			setLoading(false);
			return;
		}

		try {
			// Asegurarse de que la URL se construya correctamente
			setImageUrl(fileName);
			setLoading(false);
		} catch (err) {
			console.error("Error en useImageUrl:", err);
			setError(err instanceof Error ? err.message : "Error al obtener la URL");
			setLoading(false);
		}
	}, [fileName]);

	return { imageUrl, loading, error };
}
