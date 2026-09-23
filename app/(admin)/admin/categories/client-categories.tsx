"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
	const [editing, setEditing] = useState<Category | null>(null);
	const [confirmingId, setConfirmingId] = useState<number | null>(null);
	const [error, setError] = useState("");

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		const name = newCategory.trim();
		if (!name) return;
		setError("");
		const result = await createCategory({ name });
		if (result.error) return setError(result.error);
		setNewCategory("");
		setCategories([...categories, result.category as Category]);
	}

	async function handleRename(e: React.FormEvent) {
		e.preventDefault();
		const name = editing?.name.trim();
		if (!editing || !name) return;
		setError("");
		const result = await updateCategory(editing.id, { name });
		if (result.error) return setError(result.error);
		setEditing(null);
		setCategories(categories.map((c) => (c.id === editing.id ? { ...c, name } : c)));
	}

	async function handleDelete(id: number) {
		setError("");
		setConfirmingId(null);
		const result = await deleteCategory(id);
		if (result.error) return setError(result.error);
		setCategories(categories.filter((c) => c.id !== id));
	}

	return (
		<div className="max-w-[1280px] mx-auto px-6 lg:px-20 pt-12 pb-[120px]">
			<div className="max-w-2xl">
				<h1 className="h-display text-[44px] sm:text-[60px]">Categories</h1>
				<p className="text-ink-muted mt-3 max-w-[52ch]">
					Els filtres de la pàgina de projectes. Una categoria amb projectes no
					es pot eliminar.
				</p>

				<form onSubmit={handleCreate} className="flex gap-3 mt-10">
					<label htmlFor="new-category" className="sr-only">
						Nova categoria
					</label>
					<input
						id="new-category"
						value={newCategory}
						onChange={(e) => setNewCategory(e.target.value)}
						placeholder="Nova categoria…"
						className="field"
					/>
					<button type="submit" className="btn btn-primary" disabled={!newCategory.trim()}>
						<Plus className="size-4" /> Afegeix
					</button>
				</form>

				{error && (
					<p role="alert" className="mt-4 text-sm text-brand-ink">
						{error}
					</p>
				)}

				<ul className="mt-10 border-b border-hairline">
					{categories.map((category) => (
						<li
							key={category.id}
							className="border-t border-hairline py-3 min-h-[68px] flex items-center gap-3"
						>
							{editing?.id === category.id ? (
								<form onSubmit={handleRename} className="flex flex-1 flex-wrap gap-3">
									<label htmlFor={`rename-${category.id}`} className="sr-only">
										Nom de la categoria
									</label>
									<input
										id={`rename-${category.id}`}
										value={editing.name}
										onChange={(e) => setEditing({ ...editing, name: e.target.value })}
										// biome-ignore lint/a11y/noAutofocus: user just asked to rename
										autoFocus
										className="field flex-1 min-w-[12rem]"
									/>
									<button type="submit" className="btn btn-primary h-10 px-4">
										Desa
									</button>
									<button
										type="button"
										onClick={() => setEditing(null)}
										className="btn btn-quiet h-10 px-4"
									>
										Cancel·la
									</button>
								</form>
							) : confirmingId === category.id ? (
								<>
									<span className="flex-1">
										Eliminar <span className="font-medium">«{category.name}»</span>?
									</span>
									<button
										type="button"
										onClick={() => handleDelete(category.id)}
										className="btn h-10 px-4 bg-red-700 text-white hover:bg-red-800"
									>
										Sí, elimina
									</button>
									<button
										type="button"
										onClick={() => setConfirmingId(null)}
										className="btn btn-quiet h-10 px-4"
									>
										No
									</button>
								</>
							) : (
								<>
									<span className="flex-1 text-[17px]">{category.name}</span>
									<button
										type="button"
										onClick={() => {
											setConfirmingId(null);
											setEditing(category);
										}}
										className="text-sm text-ink-muted hover:text-ink px-2 h-10"
									>
										Canvia el nom
									</button>
									<button
										type="button"
										onClick={() => {
											setEditing(null);
											setConfirmingId(category.id);
										}}
										className="text-sm text-ink-muted hover:text-red-700 px-2 h-10"
									>
										Elimina
									</button>
								</>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
