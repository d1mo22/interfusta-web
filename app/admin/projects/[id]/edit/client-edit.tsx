/* eslint-disable @next/next/no-img-element */
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
import {
	ChevronLeft,
	Plus,
	X,
	CalendarIcon,
	Upload,
	Loader,
} from "lucide-react";
import type { Project, Category, Feature, ImageData } from "@/types/types";
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
import { Label } from "@/components/ui/label";
import { optimizeImage } from "@/lib/utils";

interface EditProjectFormProps {
	project: Project;
	categories: Category[];
	featuresData: Feature[];
	images: ImageData[];
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
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [features, setFeatures] = useState<string[]>(
		featuresData.map((f) => f.description),
	);
	const [newFeature, setNewFeature] = useState<string>("");
	const [date, setDate] = useState<Date>(new Date(project.completion_date));
	const [existingImages, setExistingImages] = useState<ImageData[]>(
		project.images || [],
	);
	const [imagesToDelete, setImagesToDelete] = useState<ImageData[]>([]);
	const [tempImages, setTempImages] = useState<File[]>([]);
	const [tempPreviews, setTempPreviews] = useState<string[]>([]);

	function addFeature() {
		if (newFeature.trim()) {
			setFeatures([...features, newFeature.trim()]);
			setNewFeature("");
		}
	}

	async function handleSubmit(formData: FormData) {
		try {
			setIsLoading(true);

			// Eliminar imágenes marcadas
			for (const image of imagesToDelete) {
				// Eliminar de R2
				const response = await fetch(
					`/api/upload?key=${image.url.split("/").pop()}`,
					{ method: "DELETE" },
				);

				if (!response.ok) {
					throw new Error("Error al eliminar imagen de R2");
				}

				// Eliminar de la base de datos
				const dbResponse = await fetch(`/api/images/${image.id}`, {
					method: "DELETE",
				});

				if (!dbResponse.ok) {
					throw new Error("Error al eliminar imagen de la base de datos");
				}
			}

			// Resto del código handleSubmit...
			formData.append("id", project.id.toString());
			formData.append("features", JSON.stringify(features));
			formData.append("existingImages", JSON.stringify(existingImages));

			// Subir imágenes a R2 y obtener URLs
			const uploadedImages = [];
			for (const file of tempImages) {
				const formDataImage = new FormData();
				formDataImage.append("file", file);

				const response = await fetch("/api/upload", {
					method: "POST",
					body: formDataImage,
				});

				if (!response.ok) {
					throw new Error("Error al subir imagen");
				}

				const data = await response.json();
				uploadedImages.push({
					url: data.url,
					altText: file.name.replace(/\.[^/.]+$/, ""),
				});
			}

			// Añadir las URLs de las imágenes al formData
			formData.append("newImages", JSON.stringify(uploadedImages));

			const result = await updateProject(formData);

			if (result.error) {
				setError(result.error);
			} else {
				tempPreviews.forEach(URL.revokeObjectURL);
				setTempImages([]);
				setTempPreviews([]);
				router.push("/admin");
				router.refresh();
			}
		} catch (error) {
			setError(error instanceof Error ? error.message : "Error desconocido");
		} finally {
			setIsLoading(false);
		}
	}

	function removeFeature(index: number) {
		setFeatures(features.filter((_, i) => i !== index));
	}

	function generateImageName(projectId: number, totalIndex: number) {
		return `project-${projectId}-image-${totalIndex + 1}.webp`;
	}

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files || []);
		const totalImagesCount = existingImages.length + tempImages.length;
		try {
			for (const [index, file] of files.entries()) {
				const optimizedBlob = await optimizeImage(file);
				const newImageName = generateImageName(
					project.id,
					totalImagesCount + index,
				);
				const optimizedFile = new File([optimizedBlob], newImageName, {
					type: "image/webp",
				});

				// Crear URL temporal para preview
				const previewUrl = URL.createObjectURL(optimizedFile);

				// Guardar imagen y preview temporal
				setTempImages((prev) => [...prev, optimizedFile]);
				setTempPreviews((prev) => [...prev, previewUrl]);
			}
		} catch (error) {
			console.error("Error:", error);
			setError(
				error instanceof Error ? error.message : "Error al procesar la imagen",
			);
		}
	}

	async function removeImage(index: number, type: "existing" | "new") {
		try {
			if (type === "existing") {
				const imageToDelete = existingImages[index];
				setImagesToDelete((prev) => [...prev, imageToDelete]);
				setExistingImages(existingImages.filter((_, i) => i !== index));
			} else {
				URL.revokeObjectURL(tempPreviews[index]);
				setTempImages(tempImages.filter((_, i) => i !== index));
				setTempPreviews(tempPreviews.filter((_, i) => i !== index));
			}
		} catch (error) {
			console.error("Error:", error);
			setError(
				error instanceof Error ? error.message : "Error al eliminar la imatge",
			);
		}
	}

	if (!project) {
		return <AdminProjectsSkeleton />;
	}

	return (
		<div className="min-h-screen pt-16 bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 py-12">
				<Link href="/admin">
					<Button variant="ghost" className="mb-6">
						<ChevronLeft className="mr-2 h-4 w-4" />
						Tornar al Panell
					</Button>
				</Link>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Editar projecte</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								const formData = new FormData(e.currentTarget);
								await handleSubmit(formData);
							}}
							className="space-y-6"
						>
							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="project-title"
										className="block text-sm font-medium text-gray-700"
									>
										Títol
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
										Categoria
									</label>
									<Select
										name="project-category"
										defaultValue={
											categories.find((c) => c.id === project.category_id)?.name
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona una categoria" />
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
									Descripció Curta
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
									Descripció Completa
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
									Característiques
								</label>
								<div className="flex gap-2 mb-2">
									<Input
										id="newFeature"
										value={newFeature}
										onChange={(e) => setNewFeature(e.target.value)}
										placeholder="Afegir una característica"
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

							<div>
								<Label htmlFor="images">Imatges del Projecte</Label>
								<div className="mt-2">
									<Input
										id="images"
										type="file"
										accept="image/*"
										multiple
										onChange={handleImageUpload}
										className="hidden"
									/>
									<Label htmlFor="images" className="cursor-pointer">
										<div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg">
											<div className="space-y-1 text-center">
												<Upload className="mx-auto h-12 w-12 text-gray-400" />
												<div className="flex text-sm text-gray-600">
													<span className="relative font-medium text-indigo-600 hover:text-indigo-500">
														Pujar imatges
													</span>
													<p className="pl-1">o arrossegar i deixar anar</p>
												</div>
												<p className="text-xs text-gray-500">
													PNG, JPG, GIF fins a 10MB
												</p>
											</div>
										</div>
									</Label>
								</div>
								<div className="mt-4 flex flex-wrap gap-2">
									{existingImages.map((image, index) => (
										<div
											key={`existing-image-${image.id}`}
											className="relative aspect-square w-20"
										>
											<img
												src={image.url}
												alt={image.alt_text}
												className="rounded-lg object-cover w-full h-full"
											/>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												className="absolute -top-1 -right-1 h-5 w-5 p-0"
												onClick={() => removeImage(index, "existing")}
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
									))}
									{/* Nuevas imágenes */}
									{tempPreviews.map((preview, index) => (
										<div
											key={`new-image-${preview}-${Date.now()}`}
											className="relative aspect-square w-20"
										>
											<img
												src={preview}
												// biome-ignore lint/a11y/noRedundantAlt: <explanation>
												alt={`New project image ${index + 1}`}
												className="rounded-lg object-cover w-full h-full"
											/>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												className="absolute -top-1 -right-1 h-5 w-5 p-0"
												onClick={() => removeImage(index, "new")}
											>
												<X className="h-3 w-3" />
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
										Data de Finalització
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
													<span>Seleccionar data</span>
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
										Durada
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
									<Button type="button" variant="outline" disabled={isLoading}>
										Cancel·lar
									</Button>
								</Link>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? (
										<Loader className="mr-2 h-4 w-4 animate-spin" />
									) : null}
									{isLoading ? "Guardant..." : "Guardar canvis"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
