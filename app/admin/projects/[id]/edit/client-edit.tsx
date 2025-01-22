"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, Plus, X, CalendarIcon } from "lucide-react";
import type { Project, Category, Feature } from "@/app/types/types";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AdminProjectsSkeleton } from "@/components/admin-projects-skeleton";

interface EditProjectFormProps {
	project: Project;
	categories: Category[];
	featuresData: Feature[];
	updateProject: (
		formData: FormData,
	) => Promise<{ success?: boolean; error?: string }>;
}

export default function EditProjectForm({
	project,
	categories,
	featuresData,
	updateProject,
}: EditProjectFormProps) {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const [features, setFeatures] = useState<string[]>(
		featuresData.map((f) => f.description),
	);
	const [newFeature, setNewFeature] = useState<string>("");
	const [date, setDate] = useState<Date>(new Date(project.completion_date));

	function addFeature() {
		if (newFeature.trim()) {
			setFeatures([...features, newFeature.trim()]);
			setNewFeature("");
		}
	}

	async function handleSubmit(formData: FormData) {
		// Agregamos el ID del proyecto y las características al formData
		formData.append("id", project.id.toString());
		formData.append("features", JSON.stringify(features));

		const result = await updateProject(formData);

		if (result.error) {
			setError(result.error);
		} else {
			router.push("/admin");
			router.refresh();
		}
	}

	function removeFeature(index: number) {
		setFeatures(features.filter((_, i) => i !== index));
	}

	if (!project) {
		return <AdminProjectsSkeleton />;
	}

	return (
		<div className="min-h-screen pt-16 bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 py-12">
				<Link href="/admin">
					<Button variant="ghost" className="mb-6">
						<ChevronLeft className="mr-2 h-4 w-4" /> Volver al Panel
					</Button>
				</Link>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Editar proyecto</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={handleSubmit} className="space-y-6">
							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="project-title"
										className="block text-sm font-medium text-gray-700"
									>
										Title
									</label>
									<Input
										id="project-title"
										name="title"
										defaultValue={project.title}
										required
										className="mt-1"
									/>
								</div>
								<div>
									<label
										htmlFor="project-category"
										className="block text-sm font-medium text-gray-700"
									>
										Category
									</label>
									<Select
										name="project-category"
										defaultValue={
											categories.find((c) => c.id === project.category_id)?.name
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											{categories
												.filter(
													(category) => category.name !== "Todos los Proyectos",
												)
												.map((category) => (
													<SelectItem key={category.id} value={category.name}>
														{category.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div>
								<label
									htmlFor="project-description"
									className="block text-sm font-medium text-gray-700"
								>
									Descripción Corta
								</label>
								<Input
									id="project-description"
									name="description"
									defaultValue={project.description}
									required
									className="mt-1"
								/>
							</div>

							<div>
								<label
									htmlFor="project-fullDescription"
									className="block text-sm font-medium text-gray-700"
								>
									Descripción Completa
								</label>
								<Textarea
									id="project-fullDescription"
									name="fullDescription"
									defaultValue={project.full_description}
									required
									className="mt-1"
									rows={6}
								/>
							</div>

							<div>
								<label
									htmlFor="newFeature"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Características
								</label>
								<div className="flex gap-2 mb-2">
									<Input
										id="newFeature"
										value={newFeature}
										onChange={(e) => setNewFeature(e.target.value)}
										placeholder="Añadir una característica"
									/>
									<Button type="button" onClick={addFeature}>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
								<div className="space-y-2">
									{features.map((feature, index) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={`${feature}-${index}`}
											className="flex items-center gap-2 bg-gray-50 p-2 rounded"
										>
											<span className="flex-grow">{feature}</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeFeature(index)}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="project-completionDate"
										className="block text-sm font-medium text-gray-700"
									>
										Fecha de Finalización
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={cn(
													"w-full justify-start text-left font-normal mt-1",
													!date && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{date ? (
													format(date, "PPP", { locale: es })
												) : (
													<span>Seleccionar fecha</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={date}
												onSelect={(newDate) => {
													setDate(newDate as Date);
													const input = document.getElementById(
														"project-completionDate",
													) as HTMLInputElement;
													input.value = newDate?.toISOString() || "";
												}}
												initialFocus
												locale={es}
											/>
										</PopoverContent>
									</Popover>
									<input
										type="hidden"
										id="project-completionDate"
										name="completionDate"
										value={date?.toISOString()}
									/>
								</div>
								<div>
									<label
										htmlFor="project-duration"
										className="block text-sm font-medium text-gray-700"
									>
										Duración
									</label>
									<Input
										id="project-duration"
										name="duration"
										defaultValue={project.duration}
										required
										className="mt-1"
									/>
								</div>
							</div>

							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<div className="flex justify-end gap-4">
								<Link href="/admin">
									<Button variant="outline">Cancelar</Button>
								</Link>
								<Button type="submit">Guardar cambios</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
