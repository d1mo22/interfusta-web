/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ca } from "date-fns/locale";
import { ArrowUpRight, Check, Loader, Plus, Search, Trash2, X } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { deleteProject } from "@/app/actions/project";
import type { Category, Project } from "@/types/types";

// Accent-insensitive, so "fusteria" finds "Fustería".
const normalize = (s: string) =>
	s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export default function AdminDashboard({
	projects,
	categories,
	savedId,
}: {
	projects: Project[];
	categories: Category[];
	savedId?: number;
}) {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [toDelete, setToDelete] = useState<Project | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState("");
	const [showSaved, setShowSaved] = useState(true);

	const categoryName = (id: number) =>
		categories.find((c) => c.id === id)?.name ?? "Sense categoria";
	const saved = showSaved && projects.find((p) => p.id === savedId);
	const usedCategories = categories.filter((c) =>
		projects.some((p) => p.category_id === c.id),
	);
	const visible = projects
		.filter(
			(p) =>
				(categoryId == null || p.category_id === categoryId) &&
				normalize(p.title).includes(normalize(query.trim())),
		)
		.sort((a, b) => b.id - a.id);

	async function confirmDelete() {
		if (!toDelete) return;
		setIsDeleting(true);
		try {
			const result = await deleteProject(toDelete.id);
			if (result.error) {
				setDeleteError(result.error);
				return;
			}
			setToDelete(null);
			router.refresh();
		} catch {
			setDeleteError("No s'ha pogut eliminar el projecte");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<div className="max-w-[1280px] mx-auto px-6 lg:px-20 pt-12 pb-[120px]">
			<header className="flex flex-wrap items-end justify-between gap-6 pb-10">
				<div>
					<h1 className="h-display text-[44px] sm:text-[60px]">
						Projectes{" "}
						<span className="font-mono text-[15px] tracking-normal text-ink-muted align-top">
							{projects.length}
						</span>
					</h1>
					<p className="text-ink-muted mt-3 max-w-[52ch]">
						Tot el que publiques aquí apareix a la web.
					</p>
				</div>
				<Link
					href="/admin/projects/new"
					className="btn btn-primary h-[54px] px-[30px] text-[17px] w-full sm:w-auto"
				>
					<Plus className="size-5" /> Nou projecte
				</Link>
			</header>

			{saved && (
				<div
					role="status"
					className="motion-rise flex items-center gap-4 border-l-4 border-brand bg-stone px-5 py-4 mb-10"
				>
					<Check className="size-5 text-brand-ink shrink-0" />
					<p className="flex-1">
						<span className="font-medium">«{saved.title}»</span> ja és a la
						web.{" "}
						<a
							href={`/portfolio/${saved.id}`}
							target="_blank"
							rel="noreferrer"
							className="underline decoration-brand decoration-2 underline-offset-4 whitespace-nowrap"
						>
							Veure-ho
						</a>
					</p>
					<button
						type="button"
						onClick={() => setShowSaved(false)}
						className="btn-icon"
						aria-label="Tanca l'avís"
					>
						<X className="size-4" />
					</button>
				</div>
			)}

			{projects.length === 0 ? (
				<div className="border-y border-hairline py-20 text-center flex flex-col items-center gap-4">
					<p className="h-display text-[30px]">Encara no hi ha cap projecte</p>
					<p className="text-ink-muted max-w-[42ch]">
						Puja les fotos d&apos;una feina acabada i explica-la en quatre
						passos. Surt a la web al moment.
					</p>
					<Link href="/admin/projects/new" className="btn btn-primary mt-4">
						<Plus className="size-4" /> Publica el primer
					</Link>
				</div>
			) : (
				<>
					<div className="flex flex-col gap-5 pb-6">
						<label className="relative block max-w-md">
							<span className="sr-only">Cerca un projecte</span>
							<Search className="absolute left-0 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
							<input
								type="search"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Cerca pel nom…"
								className="field pl-7"
							/>
						</label>
						{usedCategories.length > 1 && (
							<div className="flex flex-wrap gap-2" role="group" aria-label="Filtra per categoria">
								{[{ id: null, name: "Tots" }, ...usedCategories].map((c) => (
									<button
										key={c.id ?? "all"}
										type="button"
										aria-pressed={categoryId === c.id}
										onClick={() => setCategoryId(c.id)}
										className={`btn-press h-9 px-4 text-sm border transition-colors ${
											categoryId === c.id
												? "border-ink bg-ink text-paper"
												: "border-hairline text-ink-muted hover:text-ink hover:border-ink"
										}`}
									>
										{c.name}
									</button>
								))}
							</div>
						)}
					</div>

					{visible.length === 0 ? (
						<div className="border-t border-hairline py-16 text-center text-ink-muted">
							<p>Cap projecte coincideix amb la cerca.</p>
							<button
								type="button"
								onClick={() => {
									setQuery("");
									setCategoryId(null);
								}}
								className="mt-3 text-ink underline decoration-brand decoration-2 underline-offset-4"
							>
								Esborra els filtres
							</button>
						</div>
					) : (
						<ul className="border-b border-hairline">
							{visible.map((project) => {
								const editHref = `/admin/projects/${project.id}/edit`;
								return (
									<li
										key={project.id}
										className="grid grid-cols-[104px_1fr] sm:grid-cols-[168px_1fr_auto] gap-x-5 gap-y-3 py-5 border-t border-hairline items-center"
									>
										<Link
											href={editHref}
											tabIndex={-1}
											aria-hidden
											className="block aspect-[4/3] overflow-hidden bg-stone row-span-2 sm:row-span-1"
										>
											{project.first_image?.url && (
												<img
													src={project.first_image.url}
													alt=""
													className="size-full object-cover"
												/>
											)}
										</Link>
										<div className="min-w-0">
											<p className="text-[13px] text-ink-muted">
												{categoryName(project.category_id)} ·{" "}
												<span className="font-mono">
													{new Date(project.completion_date).getFullYear()}
												</span>
												{project.translation_pending && (
													<Link
														href={`${editHref}?tab=traduccions`}
														className="ml-2 font-mono text-brand-ink hover:underline"
													>
														Traducció pendent
													</Link>
												)}
											</p>
											<Link
												href={editHref}
												className="block font-display text-xl sm:text-2xl font-medium tracking-[-0.01em] leading-tight mt-1 hover:text-brand-ink transition-colors line-clamp-2"
											>
												{project.title}
											</Link>
											{project.last_update && (
												<p
													className="text-[13px] text-ink-muted mt-1.5"
													suppressHydrationWarning
												>
													Editat{" "}
													{formatDistanceToNow(new Date(project.last_update), {
														addSuffix: true,
														locale: ca,
													})}
													{project.updated_by && ` per ${project.updated_by}`}
												</p>
											)}
										</div>
										<div className="flex items-center gap-1 sm:justify-end">
											<Link href={editHref} className="btn btn-quiet h-10 px-4 mr-1">
												Edita
											</Link>
											<a
												href={`/portfolio/${project.id}`}
												target="_blank"
												rel="noreferrer"
												className="btn-icon"
												aria-label={`Veure «${project.title}» a la web`}
												title="Veure a la web"
											>
												<ArrowUpRight className="size-5" />
											</a>
											<button
												type="button"
												onClick={() => {
													setDeleteError("");
													setToDelete(project);
												}}
												className="btn-icon hover:text-red-700"
												aria-label={`Elimina «${project.title}»`}
												title="Elimina"
											>
												<Trash2 className="size-5" />
											</button>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</>
			)}

			<Dialog
				open={toDelete != null}
				onOpenChange={(open) => !open && !isDeleting && setToDelete(null)}
			>
				<DialogContent className="rounded-none sm:rounded-none bg-paper text-ink border-hairline max-w-md p-8 gap-5">
					<DialogTitle className="h-display text-[28px] leading-tight pr-6">
						Eliminar «{toDelete?.title}»?
					</DialogTitle>
					<DialogDescription className="text-ink-muted text-[15px]">
						El projecte i totes les seves fotos desapareixeran de la web. No
						es pot desfer.
					</DialogDescription>
					{deleteError && (
						<p role="alert" className="text-sm text-brand-ink">
							{deleteError}
						</p>
					)}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={() => setToDelete(null)}
							disabled={isDeleting}
							className="btn btn-quiet"
						>
							Cancel·la
						</button>
						<button
							type="button"
							onClick={confirmDelete}
							disabled={isDeleting}
							className="btn bg-red-700 text-white hover:bg-red-800"
						>
							{isDeleting && <Loader className="size-4 animate-spin" />}
							{isDeleting ? "Eliminant…" : "Sí, elimina"}
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
