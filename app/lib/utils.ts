export const formatDate = (date: string) => {
	if (!date) return "";
	const d = new Date(date);
	return d.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};
