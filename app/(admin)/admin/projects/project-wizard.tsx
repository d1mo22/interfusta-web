/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ca } from "date-fns/locale";
import {
	ArrowLeft,
	ArrowRight,
	ChevronLeft,
	ChevronRight,
	ImagePlus,
	Loader,
	Plus,
	RotateCw,
	Star,
	Trash2,
	X,
} from "lucide-react";
import {
	createProject,
	updateProject,
	type ProjectInput,
} from "@/app/actions/project";
import { optimizeImage } from "@/lib/utils";
import type { Category } from "@/types/types";

type Photo = {
	key: string;
	src: string; // R2 url for saved photos, local blob preview for new ones
	id?: number; // saved photo
	url?: string; // new photo, once uploaded
	file?: File; // kept so a failed upload can be retried
	status: "ready" | "uploading" | "error";
};

type Draft = {
	title: string;
	categoryId: number | null;
	description: string;
	fullDescription: string;
	completionDate: string; // yyyy-MM-dd, what <input type="date"> speaks
	duration: string;
	features: string[];
};

export type WizardInitial = Draft & {
	id: number;
	photos: { id: number; url: string }[];
};

const STEPS = [
	{
		label: "Fotos",
		title: "Comencem per les fotos",
		hint: "Tria les millors fotos de la feina acabada. La primera és la portada.",
	},
	{
		label: "Nom",
		title: "Com es diu el projecte?",
		hint: "Un nom curt i una categoria perquè la gent el trobi.",
	},
	{
		label: "Descripció",
		title: "Explica la feina",
		hint: "Escriu com ho explicaries a un client.",
	},
	{
		label: "Detalls",
		title: "Els detalls",
		hint: "Quatre dades ràpides i ja està.",
	},
	{
		label: "Revisió",
		title: "Tot a punt?",
		hint: "Revisa-ho abans de publicar. Pots tornar a qualsevol pas.",
	},
];
const REVIEW = STEPS.length - 1;
const SHORT_MAX = 160;
const DURATIONS = ["1 setmana", "2 setmanes", "1 mes", "2 mesos", "3 mesos"];

function stepErrors(step: number, d: Draft, photos: Photo[]) {
	const e: Partial<Record<keyof Draft | "photos", string>> = {};
	if (step === 0) {
		if (!photos.length) e.photos = "Afegeix almenys una foto.";
		else if (photos.some((p) => p.status === "error"))
			e.photos = "Alguna foto no s'ha pujat. Torna-ho a provar o treu-la.";
	}
	if (step === 1) {
		if (!d.title.trim()) e.title = "Posa-li un nom.";
		if (d.categoryId == null) e.categoryId = "Tria una categoria.";
	}
	if (step === 2) {
		if (!d.description.trim()) e.description = "Escriu una frase curta.";
		if (!d.fullDescription.trim())
			e.fullDescription = "Explica una mica com va ser la feina.";
	}
	if (step === 3) {
		if (!d.features.length) e.features = "Afegeix almenys una característica.";
		if (!d.completionDate) e.completionDate = "Tria la data.";
		if (!d.duration.trim()) e.duration = "Indica quant va durar.";
	}
	return e;
}

export default function ProjectWizard({
	categories,
	initial,
}: {
	categories: Category[];
	initial?: WizardInitial;
}) {
	const router = useRouter();
	const isEdit = initial != null;
	const [step, setStep] = useState(isEdit ? REVIEW : 0);
	const [reached, setReached] = useState(isEdit ? REVIEW : 0);
	const [showErrors, setShowErrors] = useState(false);
	const [draft, setDraft] = useState<Draft>(
		initial ?? {
			title: "",
			categoryId: null,
			description: "",
			fullDescription: "",
			completionDate: format(new Date(), "yyyy-MM-dd"),
			duration: "",
			features: [],
		},
	);
	const [photos, setPhotos] = useState<Photo[]>(
		(initial?.photos ?? []).map((p) => ({
			key: `saved-${p.id}`,
			src: p.url,
			id: p.id,
			status: "ready",
		})),
	);
	const [newFeature, setNewFeature] = useState("");
	const [dragOver, setDragOver] = useState(false);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [dirty, setDirty] = useState(false);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const dragFrom = useRef<number | null>(null);
	const firstRender = useRef(true);

	const errors = showErrors ? stepErrors(step, draft, photos) : {};
	const uploading = photos.filter((p) => p.status === "uploading").length;

	// New step: back to the top, and move focus so screen readers announce it.
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		window.scrollTo({ top: 0 });
		headingRef.current?.focus({ preventScroll: true });
	}, [step]);

	useEffect(() => {
		if (!dirty || saving) return;
		const warn = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [dirty, saving]);

	function set<K extends keyof Draft>(key: K, value: Draft[K]) {
		setDraft((d) => ({ ...d, [key]: value }));
		setDirty(true);
	}

	function goTo(target: number) {
		if (target > step && Object.keys(stepErrors(step, draft, photos)).length) {
			setShowErrors(true);
			return;
		}
		setShowErrors(false);
		setStep(target);
		setReached((r) => Math.max(r, target));
	}

	// ---- Photos ----

	const patch = (key: string, changes: Partial<Photo>) =>
		setPhotos((ps) => ps.map((p) => (p.key === key ? { ...p, ...changes } : p)));

	async function upload(photo: Photo) {
		if (!photo.file) return;
		patch(photo.key, { status: "uploading" });
		try {
			const blob = await optimizeImage(photo.file);
			const body = new FormData();
			body.append("file", new File([blob], "foto", { type: blob.type }));
			const res = await fetch("/api/upload", { method: "POST", body });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			patch(photo.key, { status: "ready", url: data.url });
		} catch (e) {
			console.error("Upload failed:", e);
			patch(photo.key, { status: "error" });
		}
	}

	async function addFiles(files: File[]) {
		const added: Photo[] = files
			.filter((f) => f.type.startsWith("image/"))
			.map((file) => ({
				key: crypto.randomUUID(),
				src: URL.createObjectURL(file),
				file,
				status: "uploading",
			}));
		if (!added.length) return;
		setPhotos((ps) => [...ps, ...added]);
		setDirty(true);
		// ponytail: one at a time. Decoding 20 phone photos in parallel runs
		// mobile Safari out of memory; parallelise in small batches if it's slow.
		for (const photo of added) await upload(photo);
	}

	function removePhoto(photo: Photo) {
		if (photo.src.startsWith("blob:")) URL.revokeObjectURL(photo.src);
		// Never saved, so nothing else points at the file. Saved photos are only
		// deleted server-side, after the project saves without them.
		if (photo.id == null && photo.url) {
			const key = photo.url.split("/").pop() ?? "";
			fetch(`/api/upload?key=${encodeURIComponent(key)}`, { method: "DELETE" });
		}
		setPhotos((ps) => ps.filter((p) => p.key !== photo.key));
		setDirty(true);
	}

	function move(from: number, to: number) {
		if (to < 0 || to >= photos.length || from === to) return;
		setPhotos((ps) => {
			const next = [...ps];
			const [p] = next.splice(from, 1);
			next.splice(to, 0, p);
			return next;
		});
		setDirty(true);
	}

	// ---- Features ----

	function addFeature() {
		const f = newFeature.trim();
		if (!f) return;
		set("features", [...draft.features, f]);
		setNewFeature("");
	}

	// ---- Save ----

	async function publish() {
		const bad = STEPS.slice(0, REVIEW).findIndex(
			(_, s) => Object.keys(stepErrors(s, draft, photos)).length,
		);
		if (bad !== -1) {
			setStep(bad);
			setShowErrors(true);
			return;
		}
		if (uploading) return;

		setSaving(true);
		setSaveError("");
		const input: ProjectInput = {
			...draft,
			categoryId: draft.categoryId as number,
			images: photos.map((p) => (p.id != null ? { id: p.id } : { url: p.url })),
		};
		try {
			const result = isEdit
				? await updateProject(initial.id, input)
				: await createProject(input);
			if (result.error) throw new Error(result.error);
			router.push(`/admin?desat=${result.id}`);
			router.refresh();
		} catch (e) {
			setSaveError(
				e instanceof Error && e.message
					? e.message
					: "No s'ha pogut desar. Comprova la connexió i torna-ho a provar.",
			);
			setSaving(false);
		}
	}

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (step === REVIEW) publish();
		else goTo(isEdit ? REVIEW : step + 1);
	}

	const category = categories.find((c) => c.id === draft.categoryId);

	return (
		<form onSubmit={onSubmit} noValidate>
			<div className="max-w-[1280px] mx-auto px-6 lg:px-20 pt-8 pb-16">
				<Link
					href="/admin"
					className="inline-flex items-center gap-2 text-[15px] text-ink-muted hover:text-ink transition-colors"
				>
					<ArrowLeft className="size-4" /> Projectes
				</Link>
				<p className="mt-6 text-[13px] text-ink-muted truncate">
					{isEdit ? `Editant «${initial.title}»` : "Nou projecte"}
				</p>

				{/* Progress */}
				<ol className="mt-3 grid grid-cols-5 gap-1.5">
					{STEPS.map((s, i) => (
						<li key={s.label}>
							<button
								type="button"
								onClick={() => goTo(i)}
								disabled={i > reached}
								aria-current={i === step ? "step" : undefined}
								aria-label={`Pas ${i + 1}: ${s.label}`}
								className="block w-full text-left pt-2 disabled:cursor-default group"
							>
								<span
									className={`block h-1 transition-colors duration-300 ${
										i === step ? "bg-brand" : i <= reached ? "bg-ink" : "bg-hairline"
									}`}
								/>
								<span
									className={`hidden sm:block mt-2 text-[13px] transition-colors ${
										i === step
											? "text-ink"
											: i <= reached
												? "text-ink-muted group-hover:text-ink"
												: "text-ink-muted opacity-60"
									}`}
								>
									<span className="font-mono">{i + 1}</span> {s.label}
								</span>
							</button>
						</li>
					))}
				</ol>
				<p className="sm:hidden mt-2 text-[13px] text-ink-muted">
					<span className="font-mono">
						{step + 1}/{STEPS.length}
					</span>{" "}
					· {STEPS[step].label}
				</p>

				<div key={step} className="motion-rise mt-10">
					<h1
						ref={headingRef}
						tabIndex={-1}
						className="h-display text-[36px] sm:text-[52px] outline-none"
					>
						{STEPS[step].title}
					</h1>
					<p className="text-ink-muted mt-3 max-w-[56ch]">{STEPS[step].hint}</p>

					<div className="mt-10">
						{step === 0 && (
							<div
								onDragEnter={(e) => {
									if (e.dataTransfer.types.includes("Files")) setDragOver(true);
								}}
								onDragOver={(e) => e.preventDefault()}
								onDragLeave={(e) => {
									if (!e.currentTarget.contains(e.relatedTarget as Node))
										setDragOver(false);
								}}
								onDrop={(e) => {
									e.preventDefault();
									setDragOver(false);
									if (dragFrom.current == null)
										addFiles(Array.from(e.dataTransfer.files));
								}}
								className="flex flex-col gap-6"
							>
								<label
									className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed cursor-pointer px-6 text-center transition-colors focus-within:border-brand ${
										photos.length ? "py-8" : "py-16 sm:py-24"
									} ${
										dragOver
											? "border-brand bg-stone"
											: "border-hairline hover:border-ink"
									}`}
								>
									<ImagePlus className="size-8 text-ink-muted" />
									<span className="text-[17px] font-semibold">
										{photos.length ? "Afegeix més fotos" : "Afegeix fotos"}
									</span>
									<span className="text-sm text-ink-muted max-w-[40ch]">
										Toca per fer-ne o triar-les del mòbil, o arrossega-les aquí
										des de l&apos;ordinador.
									</span>
									<input
										type="file"
										accept="image/*"
										multiple
										className="sr-only"
										aria-describedby={errors.photos ? "photos-error" : undefined}
										onChange={(e) => {
											addFiles(Array.from(e.target.files ?? []));
											e.target.value = "";
										}}
									/>
								</label>
								{errors.photos && (
									<p id="photos-error" role="alert" className="text-[13px] text-brand-ink">
										{errors.photos}
									</p>
								)}

								{photos.length > 0 && (
									<ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
										{photos.map((photo, i) => (
											<li
												key={photo.key}
												draggable
												onDragStart={(e) => {
													dragFrom.current = i;
													e.dataTransfer.effectAllowed = "move";
												}}
												onDragEnd={() => {
													dragFrom.current = null;
												}}
												onDrop={(e) => {
													if (dragFrom.current == null) return;
													e.preventDefault();
													e.stopPropagation();
													move(dragFrom.current, i);
													dragFrom.current = null;
												}}
												className="cursor-grab active:cursor-grabbing"
											>
												<div className="relative aspect-[4/3] overflow-hidden bg-stone">
													<img
														src={photo.src}
														alt={`Foto ${i + 1}`}
														draggable={false}
														className="size-full object-cover"
													/>
													<span className="absolute left-2 top-2 bg-paper text-ink font-mono text-[12px] px-1.5 py-0.5">
														{String(i + 1).padStart(2, "0")}
													</span>
													{i === 0 && (
														<span className="absolute right-2 top-2 bg-brand text-on-dark text-[12px] font-semibold px-2 py-0.5">
															Portada
														</span>
													)}
													{photo.status === "uploading" && (
														<div className="absolute inset-0 bg-scrim-soft text-on-dark text-sm flex items-center justify-center gap-2">
															<Loader className="size-4 animate-spin" /> Pujant…
														</div>
													)}
													{photo.status === "error" && (
														<div className="absolute inset-0 bg-scrim flex flex-col items-center justify-center gap-2 p-2 text-center">
															<span className="text-on-dark text-sm">No s&apos;ha pujat</span>
															<button
																type="button"
																onClick={() => upload(photo)}
																className="btn h-9 px-3 text-sm bg-paper text-ink"
															>
																<RotateCw className="size-4" /> Reintenta
															</button>
														</div>
													)}
												</div>
												<div className="flex items-center border-x border-b border-hairline">
													<button
														type="button"
														onClick={() => move(i, i - 1)}
														disabled={i === 0}
														className="btn-icon"
														aria-label={`Mou la foto ${i + 1} enrere`}
													>
														<ChevronLeft className="size-5" />
													</button>
													<button
														type="button"
														onClick={() => move(i, i + 1)}
														disabled={i === photos.length - 1}
														className="btn-icon"
														aria-label={`Mou la foto ${i + 1} endavant`}
													>
														<ChevronRight className="size-5" />
													</button>
													<button
														type="button"
														onClick={() => move(i, 0)}
														disabled={i === 0}
														className="btn-icon"
														aria-label={`Fes la foto ${i + 1} portada`}
														title="Fes-la portada"
													>
														<Star className="size-[18px]" />
													</button>
													<button
														type="button"
														onClick={() => removePhoto(photo)}
														className="btn-icon ml-auto hover:text-red-700"
														aria-label={`Treu la foto ${i + 1}`}
													>
														<Trash2 className="size-[18px]" />
													</button>
												</div>
											</li>
										))}
									</ul>
								)}
								{photos.length > 1 && (
									<p className="text-[13px] text-ink-muted">
										Ordena-les amb les fletxes o arrossegant-les. L&apos;estrella
										en fa la portada.
									</p>
								)}
							</div>
						)}

						{step === 1 && (
							<div className="flex flex-col gap-12 max-w-3xl">
								<Field
									id="title"
									label="Nom del projecte"
									error={errors.title}
								>
									<input
										id="title"
										value={draft.title}
										onChange={(e) => set("title", e.target.value)}
										placeholder="Ex.: Cuina de roure a Escaldes"
										autoComplete="off"
										aria-invalid={!!errors.title}
										aria-describedby={errors.title ? "title-error" : undefined}
										className="field h-16 font-display text-[22px] sm:text-[30px] tracking-[-0.01em]"
									/>
								</Field>
								<fieldset aria-describedby={errors.categoryId ? "categoryId-error" : undefined}>
									<legend className="text-sm font-medium mb-3">Categoria</legend>
									<div className="flex flex-wrap gap-2">
										{categories.map((c) => (
											<label
												key={c.id}
												className={`btn-press cursor-pointer h-11 px-5 inline-flex items-center border text-[15px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
													draft.categoryId === c.id
														? "border-ink bg-ink text-paper"
														: "border-hairline hover:border-ink"
												}`}
											>
												<input
													type="radio"
													name="category"
													value={c.id}
													checked={draft.categoryId === c.id}
													onChange={() => set("categoryId", c.id)}
													className="sr-only"
												/>
												{c.name}
											</label>
										))}
									</div>
									{errors.categoryId && (
										<p id="categoryId-error" className="mt-2 text-[13px] text-brand-ink">
											{errors.categoryId}
										</p>
									)}
								</fieldset>
							</div>
						)}

						{step === 2 && (
							<div className="flex flex-col gap-12 max-w-3xl">
								<Field
									id="description"
									label="Resum en una frase"
									hint="Surt a la portada de la web i als resultats de Google."
									error={errors.description}
									aside={
										<span className="font-mono">
											{draft.description.length}/{SHORT_MAX}
										</span>
									}
								>
									<input
										id="description"
										value={draft.description}
										onChange={(e) => set("description", e.target.value)}
										maxLength={SHORT_MAX}
										placeholder="Ex.: Cuina a mida en roure massís amb illa central."
										aria-invalid={!!errors.description}
										aria-describedby={
											errors.description ? "description-error" : "description-hint"
										}
										className="field"
									/>
								</Field>
								<Field
									id="fullDescription"
									label="Descripció completa"
									hint="Què vau fer, amb quins materials i què el fa especial."
									error={errors.fullDescription}
								>
									<textarea
										id="fullDescription"
										value={draft.fullDescription}
										onChange={(e) => set("fullDescription", e.target.value)}
										rows={8}
										aria-invalid={!!errors.fullDescription}
										aria-describedby={
											errors.fullDescription
												? "fullDescription-error"
												: "fullDescription-hint"
										}
										className="field h-auto py-3 leading-relaxed resize-y"
									/>
								</Field>
							</div>
						)}

						{step === 3 && (
							<div className="flex flex-col gap-12 max-w-3xl">
								<div className="flex flex-col gap-4">
									<Field
										id="feature"
										label="Característiques"
										hint="Materials, acabats, mesures… Prem Retorn per afegir-ne cada una."
										error={errors.features}
									>
										<div className="flex gap-2">
											<input
												id="feature"
												value={newFeature}
												onChange={(e) => setNewFeature(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														addFeature();
													}
												}}
												placeholder="Ex.: Roure massís envernissat"
												aria-invalid={!!errors.features}
												aria-describedby={errors.features ? "feature-error" : "feature-hint"}
												className="field"
											/>
											<button
												type="button"
												onClick={addFeature}
												className="btn btn-quiet px-4"
												aria-label="Afegeix la característica"
											>
												<Plus className="size-5" />
											</button>
										</div>
									</Field>
									{draft.features.length > 0 && (
										<ul className="flex flex-wrap gap-2">
											{draft.features.map((f, i) => (
												<li
													// biome-ignore lint/suspicious/noArrayIndexKey: duplicates allowed
													key={`${f}-${i}`}
													className="inline-flex items-center bg-stone pl-3.5 text-[15px]"
												>
													{f}
													<button
														type="button"
														onClick={() =>
															set(
																"features",
																draft.features.filter((_, j) => j !== i),
															)
														}
														className="btn-icon size-9"
														aria-label={`Treu «${f}»`}
													>
														<X className="size-4" />
													</button>
												</li>
											))}
										</ul>
									)}
								</div>

								<div className="grid sm:grid-cols-2 gap-12">
									<Field
										id="completionDate"
										label="Data de finalització"
										error={errors.completionDate}
									>
										<input
											id="completionDate"
											type="date"
											value={draft.completionDate}
											max={format(new Date(), "yyyy-MM-dd")}
											onChange={(e) => set("completionDate", e.target.value)}
											aria-invalid={!!errors.completionDate}
											className="field font-mono"
										/>
									</Field>
									<div className="flex flex-col gap-3">
										<Field id="duration" label="Durada" error={errors.duration}>
											<input
												id="duration"
												value={draft.duration}
												onChange={(e) => set("duration", e.target.value)}
												placeholder="Ex.: 3 setmanes"
												aria-invalid={!!errors.duration}
												className="field"
											/>
										</Field>
										<div className="flex flex-wrap gap-2">
											{DURATIONS.map((d) => (
												<button
													key={d}
													type="button"
													onClick={() => set("duration", d)}
													className="btn-press h-8 px-3 text-[13px] border border-hairline text-ink-muted hover:text-ink hover:border-ink transition-colors"
												>
													{d}
												</button>
											))}
										</div>
									</div>
								</div>
							</div>
						)}

						{step === REVIEW && (
							<div className="grid lg:grid-cols-[7fr_5fr] gap-10 lg:gap-16 items-start">
								<div className="flex flex-col gap-3">
									{photos[0] && (
										<div className="relative aspect-[3/2] overflow-hidden bg-stone">
											<img
												src={photos[0].src}
												alt="Portada"
												className="size-full object-cover"
											/>
										</div>
									)}
									{photos.length > 1 && (
										<div className="grid grid-cols-5 gap-2">
											{photos.slice(1, 10).map((p, i) => (
												<img
													key={p.key}
													src={p.src}
													alt={`Foto ${i + 2}`}
													className="aspect-square object-cover bg-stone"
												/>
											))}
										</div>
									)}
									<div className="flex items-center justify-between text-sm">
										<span className="text-ink-muted">
											<span className="font-mono">{photos.length}</span>{" "}
											{photos.length === 1 ? "foto" : "fotos"}
										</span>
										<EditButton onClick={() => goTo(0)} />
									</div>
								</div>

								<dl className="border-t border-hairline">
									{[
										{ step: 1, label: "Nom", value: draft.title },
										{ step: 1, label: "Categoria", value: category?.name },
										{ step: 2, label: "Resum", value: draft.description },
										{
											step: 2,
											label: "Descripció",
											value: (
												<span className="line-clamp-4 whitespace-pre-line">
													{draft.fullDescription}
												</span>
											),
										},
										{ step: 3, label: "Característiques", value: draft.features.join(" · ") },
										{
											step: 3,
											label: "Data de finalització",
											value: draft.completionDate && (
												<span className="font-mono">
													{format(new Date(`${draft.completionDate}T00:00`), "d MMMM yyyy", {
														locale: ca,
													})}
												</span>
											),
										},
										{ step: 3, label: "Durada", value: draft.duration },
									].map((row) => (
										<div
											key={row.label}
											className="grid grid-cols-[1fr_auto] gap-x-4 py-4 border-b border-hairline"
										>
											<dt className="text-[13px] text-ink-muted">{row.label}</dt>
											<EditButton
												onClick={() => goTo(row.step)}
												className="row-span-2 self-start"
											/>
											<dd className="mt-1 min-w-0 break-words">
												{row.value || <span className="text-brand-ink">Falta</span>}
											</dd>
										</div>
									))}
								</dl>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Action bar: pinned to the bottom so it's always under the thumb. */}
			<div className="sticky bottom-0 z-10 border-t border-hairline bg-paper">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-3">
					{step > 0 ? (
						<button
							type="button"
							onClick={() => goTo(step - 1)}
							className="btn btn-quiet px-4 sm:px-6"
							aria-label="Enrere"
						>
							<ArrowLeft className="size-4" />
							<span className="hidden sm:inline">Enrere</span>
						</button>
					) : (
						<Link href="/admin" className="btn btn-quiet">
							Cancel·la
						</Link>
					)}
					<p className="flex-1 min-w-0 text-[13px] text-ink-muted truncate" aria-live="polite">
						{saveError ? (
							<span role="alert" className="text-brand-ink">
								{saveError}
							</span>
						) : uploading > 0 ? (
							<span className="inline-flex items-center gap-2">
								<Loader className="size-3.5 animate-spin" />
								Pujant fotos… queden <span className="font-mono">{uploading}</span>
							</span>
						) : null}
					</p>
					{step < REVIEW ? (
						<button type="submit" className="btn btn-primary">
							{isEdit ? "Fet" : "Continua"} <ArrowRight className="size-4" />
						</button>
					) : (
						<button
							type="submit"
							disabled={saving || uploading > 0}
							className="btn btn-primary"
						>
							{saving && <Loader className="size-4 animate-spin" />}
							{saving ? "Desant…" : isEdit ? "Desa els canvis" : "Publica"}
						</button>
					)}
				</div>
			</div>
		</form>
	);
}

function Field({
	id,
	label,
	hint,
	error,
	aside,
	children,
}: {
	id: string;
	label: string;
	hint?: string;
	error?: string;
	aside?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={id} className="text-sm font-medium">
				{label}
			</label>
			{children}
			<div className="flex justify-between gap-4 text-[13px]">
				{error ? (
					<p id={`${id}-error`} className="text-brand-ink">
						{error}
					</p>
				) : (
					<p id={`${id}-hint`} className="text-ink-muted">
						{hint}
					</p>
				)}
				{aside && <span className="text-ink-muted shrink-0">{aside}</span>}
			</div>
		</div>
	);
}

function EditButton({
	onClick,
	className = "",
}: {
	onClick: () => void;
	className?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`text-sm text-ink underline decoration-hairline decoration-1 underline-offset-4 hover:decoration-brand transition-colors ${className}`}
		>
			Edita
		</button>
	);
}
