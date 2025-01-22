import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import type { Project, Category } from "@/app/types/types";

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
			<CardContent className="p-6">
				<div className="flex items-start gap-6">
					<div className="relative h-32 w-48 flex-shrink-0">
						<img
							src={project.first_image.url || "/placeholder.svg"}
							alt={project.title}
							className="rounded-lg w-full h-full object-cover"
						/>
					</div>
					<div className="flex-grow">
						<h2 className="text-xl font-bold mb-1">{project.title}</h2>
						<p className="text-gray-600 mb-1">{project.description}</p>
						<p className="text-sm text-gray-500 mb-1">
							Categoría:{" "}
							{categories.find((cat) => cat.id === project.category_id)?.name}
						</p>
						{project.last_update && (
							<p className="text-sm text-gray-500 mb-1">
								Última modificación: {formatDate(project.last_update)}
							</p>
						)}
						{project.updated_by && (
							<p className="text-sm text-gray-500">
								Modificado por: {project.updated_by}
							</p>
						)}
					</div>
					<div className="flex gap-2">
						<Link href={`/admin/projects/${project.id}/edit`}>
							<Button variant="outline" size="sm">
								<Pencil className="h-4 w-4 mr-2" />
								Editar
							</Button>
						</Link>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => onDeleteClick(project)}
							disabled={isDeleting}
						>
							<Trash className="h-4 w-4 mr-2" />
							{isDeleting ? "Eliminando..." : "Eliminar"}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
