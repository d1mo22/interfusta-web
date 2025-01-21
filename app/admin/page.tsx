"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash } from "lucide-react";
import { deleteProject } from "../actions/project";

interface Project {
	id: string;
	title: string;
	category: string;
	description: string;
	images: string[];
}

export default function AdminDashboard() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	useEffect(() => {
		async function fetchProjects() {
			// In a real application, you would fetch projects from an API
			// For now, we'll use dummy data
			const dummyProjects: Project[] = [
				{
					id: "1",
					title: "Modern Kitchen Renovation",
					category: "kitchens",
					description:
						"Complete kitchen renovation with custom cabinets and island",
					images: ["https://placehold.co/800x600"],
				},
				{
					id: "2",
					title: "Custom Dining Table",
					category: "furniture",
					description: "Handcrafted oak dining table with matching chairs",
					images: ["https://placehold.co/800x600"],
				},
			];
			setProjects(dummyProjects);
			setIsLoading(false);
		}

		fetchProjects();
	}, []);

	async function handleDelete(id: string) {
		setIsDeleting(id);
		await deleteProject(id);
		setProjects(projects.filter((project) => project.id !== id));
		setIsDeleting(null);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<div className="min-h-screen pt-16 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Project Management</h1>
					<Link href="/admin/projects/new">
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Add New Project
						</Button>
					</Link>
				</div>

				{projects.length === 0 ? (
					<Card>
						<CardContent className="p-6 text-center">
							<p>No projects found. Start by adding a new project.</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-6">
						{projects.map((project) => (
							<Card key={project.id}>
								<CardContent className="p-6">
									<div className="flex items-start gap-6">
										<div className="relative h-32 w-48 flex-shrink-0">
											<img
												src={project.images[0] || "/placeholder.svg"}
												alt={project.title}
												className="rounded-lg w-full h-full object-cover"
											/>
										</div>
										<div className="flex-grow">
											<h2 className="text-xl font-bold mb-2">
												{project.title}
											</h2>
											<p className="text-gray-600 mb-2">
												{project.description}
											</p>
											<p className="text-sm text-gray-500">
												Category: {project.category}
											</p>
										</div>
										<div className="flex gap-2">
											<Link href={`/admin/projects/${project.id}/edit`}>
												<Button variant="outline" size="sm">
													<Pencil className="h-4 w-4 mr-2" />
													Edit
												</Button>
											</Link>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleDelete(project.id)}
												disabled={isDeleting === project.id}
											>
												<Trash className="h-4 w-4 mr-2" />
												{isDeleting === project.id ? "Deleting..." : "Delete"}
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
