export function useImageUrl(fileName: string) {
	if (!fileName) {
		return {
			imageUrl: null,
			loading: false,
			error: "Nombre de archivo no proporcionado",
		};
	}

	return { imageUrl: fileName, loading: false, error: null };
}
