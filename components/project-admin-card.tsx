/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash, Loader } from "lucide-react";
import Link from "next/link";
import type { Project, Category } from "@/types/types";

interface ProjectCardProps {
	project: Project;
	categories: Category[];
	onDeleteClick: (project: Project) => void;
	isDeleting: boolean;
	formatDate: (date: string) => string;
}

export function ProjectCard({
	project,
	categories,
	onDeleteClick,
	isDeleting,
	formatDate,
}: ProjectCardProps) {
	return (
		<Card>
			<CardContent className="p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
					{/* Imagen */}
					<div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
						<img
							src={project.first_image.url || "/placeholder.svg"}
							alt={project.title}
							className="rounded-lg w-full h-full object-cover"
						/>
					</div>

					{/* Contenido */}
					<div className="flex-grow space-y-2">
						<h2 className="text-xl font-bold">{project.title}</h2>
						<p className="text-gray-600 text-sm">{project.description}</p>
						<div className="space-y-1">
							<p className="text-sm text-gray-500">
								Categoría:{" "}
								{categories.find((cat) => cat.id === project.category_id)?.name}
							</p>
							{project.last_update && (
								<p className="text-sm text-gray-500">
									Última modificación: {formatDate(project.last_update)}
								</p>
							)}
							{project.updated_by && (
								<p className="text-sm text-gray-500">
									Modificado por: {project.updated_by}
								</p>
							)}
						</div>
					</div>

					{/* Acciones */}
					<div className="flex sm:flex-col justify-end gap-2 mt-4 sm:mt-0">
						<Link
							href={`/admin/projects/${project.id}/edit`}
							className="w-full sm:w-auto"
						>
							<Button variant="outline" size="sm" className="w-full">
								<Pencil className="h-4 w-4 mr-2" />
								Editar
							</Button>
						</Link>
						<Button
							variant="destructive"
							size="sm"
							className="w-full sm:w-auto"
							onClick={() => onDeleteClick(project)}
							disabled={isDeleting}
						>
							{isDeleting ? (
								<Loader className="h-4 w-4 animate-spin" />
							) : (
								<Trash className="h-4 w-4 mr-2" />
							)}
							{isDeleting ? "Eliminando..." : "Eliminar"}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
