import { useState } from "react";
import type { Project } from "@/types/types";

export function useProjectDelete() {
	const [isDeleting, setIsDeleting] = useState<number | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

	const handleDeleteClick = (project: Project) => {
		setProjectToDelete(project);
		setShowDeleteDialog(true);
	};

	const handleDelete = async () => {
		if (!projectToDelete) return;

		setIsDeleting(projectToDelete.id);

		try {
			const response = await fetch(`/api/projects/${projectToDelete.id}`, {
				method: "DELETE",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Error al eliminar el proyecto");
			}

			//router.refresh();
			//router.push("/admin");
			window.location.reload();
		} catch (error) {
			console.error("Error:", error);
			alert("Error al eliminar el proyecto");
		} finally {
			setIsDeleting(null);
			setShowDeleteDialog(false);
			setProjectToDelete(null);
		}
	};

	return {
		isDeleting,
		showDeleteDialog,
		projectToDelete,
		handleDeleteClick,
		handleDelete,
		setShowDeleteDialog,
	};
}
