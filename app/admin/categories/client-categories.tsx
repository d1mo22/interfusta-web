"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, Plus, Pencil, Trash } from "lucide-react";
import {
	createCategory,
	updateCategory,
	deleteCategory,
} from "@/app/actions/categories";
import type { Category } from "@/types/types";

export default function CategoryManagement({
	initialCategories,
}: {
	initialCategories: Category[];
}) {
	const [categories, setCategories] = useState<Category[]>(initialCategories);
	const [newCategory, setNewCategory] = useState("");
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [error, setError] = useState<string>("");

	async function handleCreateCategory(e: React.FormEvent) {
		e.preventDefault();
		if (newCategory.trim()) {
			const result = await createCategory({ name: newCategory.trim() });
			if (result.error) {
				setError(result.error);
			} else if (
				result.category &&
				"id" in result.category &&
				"name" in result.category
			) {
				setNewCategory("");
				setCategories([...categories, result.category as Category]);
			}
		}
	}

	async function handleUpdateCategory(e: React.FormEvent) {
		e.preventDefault();
		if (editingCategory?.name.trim()) {
			const result = await updateCategory(editingCategory.id, {
				name: editingCategory.name.trim(),
			});
			if (result.error) {
				setError(result.error);
			} else if (result.category) {
				setEditingCategory(null);
				setCategories(
					categories.map((cat) =>
						cat.id === result.category?.id
							? { id: result.category.id, name: result.category.name }
							: cat,
					),
				);
			}
		}
	}

	async function handleDeleteCategory(id: number) {
		const result = await deleteCategory(id);
		if (result.error) {
			setError(result.error);
		} else {
			setCategories(categories.filter((cat) => cat.id !== id));
		}
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
						<CardTitle className="text-2xl">Gestió de Categories</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleCreateCategory} className="flex gap-2 mb-6">
							<Input
								value={newCategory}
								onChange={(e) => setNewCategory(e.target.value)}
								placeholder="Nou nom de categoria"
							/>
							<Button type="submit">
								<Plus className="h-4 w-4 mr-2" />
								Afegir Categoria
							</Button>
						</form>

						{error && (
							<Alert variant="destructive" className="mb-6">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-4">
							{categories.map((category) => (
								<Card key={category.id}>
									<CardContent className="p-4 flex items-center justify-between">
										{editingCategory && editingCategory.id === category.id ? (
											<form
												onSubmit={handleUpdateCategory}
												className="flex-grow flex gap-2"
											>
												<Input
													value={editingCategory.name}
													onChange={(e) =>
														setEditingCategory({
															...editingCategory,
															name: e.target.value,
														})
													}
												/>
												<Button type="submit">Guardar</Button>
												<Button
													type="button"
													variant="outline"
													onClick={() => setEditingCategory(null)}
												>
													Cancel·lar
												</Button>
											</form>
										) : (
											<>
												<span>{category.name}</span>
												<div>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => setEditingCategory(category)}
														className="mr-2"
													>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="hover:bg-red-100 hover:text-red-500"
														onClick={() => handleDeleteCategory(category.id)}
													>
														<Trash className="h-4 w-4" />
													</Button>
												</div>
											</>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
