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
import { createProject } from "@/app/actions/project";
import {
	CalendarIcon,
	ChevronLeft,
	Loader,
	Plus,
	Upload,
	X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import type { Category } from "@/types/types";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ca } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { optimizeImage } from "@/lib/utils";

export default function NewProjectForm({
	categories,
}: { categories: Category[] }) {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const [features, setFeatures] = useState<string[]>([]);
	const [newFeature, setNewFeature] = useState<string>("");
	const [date, setDate] = useState<Date>(new Date());
	const [tempImages, setTempImages] = useState<File[]>([]);
	const [tempPreviews, setTempPreviews] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function handleSubmit(formData: FormData) {
		try {
			setIsLoading(true);

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
					altText: file.name,
				});
			}

			// Append all form data
			formData.append("images", JSON.stringify(uploadedImages));
			formData.append("features", JSON.stringify(features));

			// Pasar formData a createProject
			const result = await createProject(formData);

			if (result.error) {
				setError(result.error);
			} else {
				router.push("/admin");
				router.refresh();
			}
		} catch (error) {
			setError(error instanceof Error ? error.message : "Error desconocido");
		} finally {
			setIsLoading(false);
		}
	}

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files || []);

		try {
			for (const file of files) {
				const optimizedBlob = await optimizeImage(file);
				const optimizedFile = new File(
					[optimizedBlob],
					file.name.replace(/\.[^/.]+$/, ".webp"),
					{
						type: "image/webp",
					},
				);

				const previewUrl = URL.createObjectURL(optimizedFile);

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

	function removeImage(index: number) {
		URL.revokeObjectURL(tempPreviews[index]);
		setTempImages(tempImages.filter((_, i) => i !== index));
		setTempPreviews(tempPreviews.filter((_, i) => i !== index));
	}

	function addFeature() {
		if (newFeature.trim()) {
			setFeatures([...features, newFeature.trim()]);
			setNewFeature("");
		}
	}

	function removeFeature(index: number) {
		setFeatures(features.filter((_, i) => i !== index));
	}

	return (
		<div className="min-h-screen pt-16 bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 py-12">
				<Link href="/admin">
					<Button variant="ghost" className="mb-6">
						<ChevronLeft className="mr-2 h-4 w-4" /> Tornar al Panell
					</Button>
				</Link>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Afegir Nou Projecte</CardTitle>
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
										htmlFor="title"
										className="block text-sm font-medium text-gray-700"
									>
										Títol
									</label>
									<Input id="title" name="title" required className="mt-1" />
								</div>
								<div>
									<label
										htmlFor="category"
										className="block text-sm font-medium text-gray-700"
									>
										Categoria
									</label>
									<Select name="category">
										<SelectTrigger>
											<SelectValue placeholder="Selecciona una categoria" />
										</SelectTrigger>
										<SelectContent>
											{categories.slice(1).map((category) => (
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
									htmlFor="description"
									className="block text-sm font-medium text-gray-700"
								>
									Descripció Curta
								</label>
								<Input
									id="description"
									name="description"
									required
									className="mt-1"
								/>
							</div>

							<div>
								<label
									htmlFor="fullDescription"
									className="block text-sm font-medium text-gray-700"
								>
									Descripció Completa
								</label>
								<Textarea
									id="fullDescription"
									name="fullDescription"
									required
									className="mt-1"
									rows={6}
								/>
							</div>

							<div>
								<label
									htmlFor="features"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Característiques
								</label>
								<div className="flex gap-2 mb-2">
									<Input
										id="features"
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
												onClick={() => removeImage(index)}
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
													format(date, "PPP", { locale: ca })
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
												locale={ca}
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
									<Button variant="outline">Cancel·lar</Button>
								</Link>
								<Button
									type="submit"
									disabled={isLoading}
									className="flex items-center justify-center gap-2"
								>
									{isLoading && <Loader className="h-4 w-4 animate-spin" />}
									{isLoading ? "Creant..." : "Crear Projecte"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
