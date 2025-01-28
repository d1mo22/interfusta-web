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
import { CalendarIcon, ChevronLeft, Plus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import type { Category } from "@/types/types";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";

export default function NewProjectForm({
	categories,
}: { categories: Category[] }) {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const [features, setFeatures] = useState<string[]>([]);
	const [newFeature, setNewFeature] = useState<string>("");
	const [date, setDate] = useState<Date>(new Date());

	async function handleSubmit(formData: FormData) {
		formData.append("features", JSON.stringify(features));
		const result = await createProject();

		if (result.error) {
			setError(result.error);
		} else {
			router.push("/admin");
			router.refresh();
		}
	}

	function addFeature() {
		if (newFeature.trim()) {
			setFeatures([...features, newFeature.trim()]);
			setNewFeature("");
		}
	}

	function addCategory() {
		// Implementar lógica para añadir una nueva categoría
		return;
	}

	function removeFeature(index: number) {
		setFeatures(features.filter((_, i) => i !== index));
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
						<CardTitle className="text-2xl">Añadir Nuevo Proyecto</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={handleSubmit} className="space-y-6">
							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="title"
										className="block text-sm font-medium text-gray-700"
									>
										Título
									</label>
									<Input id="title" name="title" required className="mt-1" />
								</div>
								<div>
									<label
										htmlFor="category"
										className="block text-sm font-medium text-gray-700"
									>
										Categoría
									</label>
									<div className="flex gap-2 mt-1">
										<Select name="category">
											<SelectTrigger>
												<SelectValue placeholder="Selecciona una categoría" />
											</SelectTrigger>
											<SelectContent>
												{categories.slice(1).map((category) => (
													<SelectItem key={category.id} value={category.name}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Button type="button" onClick={addCategory}>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>

							<div>
								<label
									htmlFor="description"
									className="block text-sm font-medium text-gray-700"
								>
									Descripción Corta
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
									Descripción Completa
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
									Características
								</label>
								<div className="flex gap-2 mb-2">
									<Input
										id="features"
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
								<Button type="submit">Crear Proyecto</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
