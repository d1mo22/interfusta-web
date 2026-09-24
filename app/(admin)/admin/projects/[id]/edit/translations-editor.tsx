"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGE_NAMES, TARGETS, type Target } from "@/lib/i18n-config";
import type { FieldTranslations, ProjectField } from "@/lib/translate";
import { retranslateProject, updateProjectTranslations } from "@/app/actions/project";

// Same labels as the wizard's review step.
const FIELD_LABELS: Record<ProjectField, string> = {
	title: "Nom",
	description: "Resum",
	full_description: "Descripció",
	duration: "Durada",
};
const FIELDS = Object.keys(FIELD_LABELS) as ProjectField[];
const LONG: ProjectField[] = ["description", "full_description"];

type Feature = {
	id: number;
	description: string;
	translations: FieldTranslations<"description"> | null;
};

export default function TranslationsEditor({
	projectId,
	catalan,
	features,
	initial,
	pending,
}: {
	projectId: number;
	catalan: Record<ProjectField, string>;
	features: Feature[];
	initial: FieldTranslations<ProjectField> | null;
	pending: boolean;
}) {
	const router = useRouter();
	const [lang, setLang] = useState<Target>("es");
	const [project, setProject] = useState(initial ?? {});
	const [featureTr, setFeatureTr] = useState(() => byId(features));
	const [busy, setBusy] = useState<"save" | "retry" | null>(null);
	const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

	// After router.refresh() the server sends fresh props; adopt them (same idiom as image-gallery-modal).
	const [prev, setPrev] = useState({ initial, features });
	if (prev.initial !== initial || prev.features !== features) {
		setPrev({ initial, features });
		setProject(initial ?? {});
		setFeatureTr(byId(features));
	}

	// Unsaved changes since the last server sync (`prev`): retry must never
	// overwrite these with a refresh, since that would silently discard them.
	const dirty =
		JSON.stringify(project) !== JSON.stringify(prev.initial ?? {}) ||
		JSON.stringify(featureTr) !== JSON.stringify(byId(prev.features));

	const setField = (field: ProjectField, value: string) =>
		setProject((p) => ({ ...p, [lang]: { ...p[lang], [field]: value } }));
	const setFeature = (id: number, value: string) =>
		setFeatureTr((f) => ({ ...f, [id]: { ...f[id], [lang]: { description: value } } }));

	async function run(kind: "save" | "retry") {
		setBusy(kind);
		setMessage(null);
		try {
			const result =
				kind === "save"
					? await updateProjectTranslations(projectId, {
							project,
							features: features.map((f) => ({ id: f.id, translations: featureTr[f.id] })),
						})
					: await retranslateProject(projectId);
			setMessage(
				result.error
					? { text: result.error, error: true }
					: {
							text: kind === "save" ? "Traduccions desades" : "Traduccions completades",
							error: false,
						},
			);
			// A failed save changed nothing: keep the typed edits instead of
			// resetting them to the server's copy. A retry may have saved part.
			if (!result.error || kind === "retry") router.refresh();
		} catch {
			setMessage({ text: "No s'ha pogut connectar. Torna-ho a provar.", error: true });
		} finally {
			setBusy(null);
		}
	}

	return (
		<div className="max-w-[900px] flex flex-col gap-8">
			{pending && (
				<div className="flex flex-wrap items-center justify-between gap-4 border border-hairline p-4">
					<p className="text-[15px]">Falten traduccions. A la web es mostra el text en català.</p>
					<div className="flex items-center gap-3">
						{dirty && <span className="text-[13px] text-ink-muted">Desa primer els canvis.</span>}
						<button
							type="button"
							className="btn btn-quiet h-10 px-4"
							disabled={busy !== null || dirty}
							onClick={() => run("retry")}
						>
							{busy === "retry" && <Loader className="size-4 mr-2 animate-spin" />}
							Retradueix el que falta
						</button>
					</div>
				</div>
			)}

			<div role="tablist" aria-label="Idioma" className="flex gap-7 border-b border-hairline">
				{TARGETS.map((t) => (
					<button
						key={t}
						id={`tr-tab-${t}`}
						type="button"
						role="tab"
						aria-selected={t === lang}
						aria-controls="tr-panel"
						onClick={() => setLang(t)}
						className={
							t === lang
								? "pb-3 text-[15px] text-ink underline decoration-brand decoration-2 underline-offset-[7px]"
								: "pb-3 text-[15px] text-ink-muted hover:text-ink"
						}
					>
						{LANGUAGE_NAMES[t]}
					</button>
				))}
			</div>

			<div
				id="tr-panel"
				role="tabpanel"
				aria-labelledby={`tr-tab-${lang}`}
				className="flex flex-col gap-8"
			>
				<fieldset disabled={busy !== null} className="contents">
					{FIELDS.map((field) => {
						const props = {
							id: `tr-${lang}-${field}`,
							lang,
							value: project[lang]?.[field] ?? "",
							className: "rounded-none",
						};
						return (
							<div key={field} className="flex flex-col gap-2">
								<label htmlFor={props.id} className="text-sm font-medium">
									{FIELD_LABELS[field]}
								</label>
								<p lang="ca" className="text-[13px] text-ink-muted whitespace-pre-line">
									{catalan[field]}
								</p>
								{LONG.includes(field) ? (
									<Textarea
										{...props}
										rows={field === "full_description" ? 8 : 3}
										onChange={(e) => setField(field, e.target.value)}
									/>
								) : (
									<Input {...props} onChange={(e) => setField(field, e.target.value)} />
								)}
							</div>
						);
					})}

					{features.length > 0 && (
						<fieldset className="flex flex-col gap-4">
							<legend className="text-sm font-medium mb-2">Característiques</legend>
							{features.map((f) => (
								<div key={f.id} className="flex flex-col gap-1">
									<label
										htmlFor={`tr-${lang}-f${f.id}`}
										lang="ca"
										className="text-[13px] text-ink-muted"
									>
										{f.description}
									</label>
									<Input
										id={`tr-${lang}-f${f.id}`}
										lang={lang}
										value={featureTr[f.id]?.[lang]?.description ?? ""}
										onChange={(e) => setFeature(f.id, e.target.value)}
										className="rounded-none"
									/>
								</div>
							))}
						</fieldset>
					)}
				</fieldset>
			</div>

			<div className="flex items-center gap-4">
				<button
					type="button"
					className="btn btn-primary"
					disabled={busy !== null}
					onClick={() => run("save")}
				>
					{busy === "save" && <Loader className="size-4 mr-2 animate-spin" />}
					Desa les traduccions
				</button>
				{message && (
					<p
						role={message.error ? "alert" : "status"}
						className={message.error ? "text-sm text-brand-ink" : "text-sm"}
					>
						{message.text}
					</p>
				)}
			</div>
		</div>
	);
}

function byId(features: Feature[]) {
	return Object.fromEntries(features.map((f) => [f.id, f.translations ?? {}])) as Record<
		number,
		FieldTranslations<"description">
	>;
}
