// Machine translation from Catalan with Azure Translator (free F0 tier,
// 2M characters/month). One request covers all four target languages.
// Never throws: callers treat null as "translation pending" and keep the
// Catalan text, which the site shows as the fallback.
import { TARGETS, type Target } from "./i18n-config.ts";

const ENDPOINT =
	"https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=ca";
// Azure's bare "pt" is Brazilian Portuguese.
const AZURE_CODE: Record<Target, string> = { es: "es", fr: "fr", en: "en", pt: "pt-pt" };

export type TranslatedTexts = Record<Target, string[]>;
// Shape of the `translations` jsonb column: { es: { title: "..." }, fr: {...} }
export type FieldTranslations<K extends string> = Partial<
	Record<Target, Partial<Record<K, string>>>
>;

export async function translateTexts(texts: string[]): Promise<TranslatedTexts | null> {
	const out = Object.fromEntries(TARGETS.map((t) => [t, [] as string[]])) as TranslatedTexts;
	if (!texts.length) return out;

	const key = process.env.AZURE_TRANSLATOR_KEY;
	const region = process.env.AZURE_TRANSLATOR_REGION;
	if (!key || !region) {
		console.error("Azure Translator is not configured");
		return null;
	}

	try {
		const res = await fetch(ENDPOINT + TARGETS.map((t) => `&to=${AZURE_CODE[t]}`).join(""), {
			method: "POST",
			headers: {
				"Ocp-Apim-Subscription-Key": key,
				"Ocp-Apim-Subscription-Region": region,
				"Content-Type": "application/json; charset=UTF-8",
			},
			body: JSON.stringify(texts.map((text) => ({ text }))),
			signal: AbortSignal.timeout(8000),
		});
		// 403 is what the free tier answers once the monthly quota is used up.
		if (!res.ok) {
			console.error("Azure Translator error", res.status, await res.text());
			return null;
		}
		// One entry per input text, in order; one translation per `to`, in `to` order.
		const data = (await res.json()) as { translations: { text: string }[] }[];
		for (const item of data) TARGETS.forEach((t, i) => out[t].push(item.translations[i].text));
		return out;
	} catch (e) {
		console.error("Azure Translator request failed", e);
		return null;
	}
}

export async function translateFields<K extends string>(
	fields: Partial<Record<K, string>>,
): Promise<FieldTranslations<K> | null> {
	const keys = (Object.keys(fields) as K[]).filter((k) => fields[k]?.trim());
	const result = await translateTexts(keys.map((k) => fields[k] as string));
	if (!result) return null;
	return Object.fromEntries(
		TARGETS.map((t) => [t, Object.fromEntries(keys.map((k, i) => [k, result[t][i]]))]),
	) as FieldTranslations<K>;
}

// Catalan project columns that get translated (the jsonb keys use the same names).
export const PROJECT_FIELDS = ["title", "description", "full_description", "duration"] as const;
export type ProjectField = (typeof PROJECT_FIELDS)[number];

// Fresh machine output replaces only the fields whose Catalan changed, so a
// hand-corrected translation survives edits to other fields. If translating
// failed (fresh = null), the changed fields are dropped instead: the site then
// falls back to the new Catalan rather than showing a stale translation.
// `pending` fields (Catalan unchanged, but untranslated in some languages) take
// the fresh value only in languages where the stored one is missing or blank,
// so hand fixes elsewhere survive; with fresh = null they are left as stored.
// Fresh values for fields in neither list, and blank fresh values, are ignored
// (a changed field with a blank fresh value is dropped, so Catalan shows).
export function mergeTranslations<K extends string>(
	old: FieldTranslations<K> | null | undefined,
	fresh: FieldTranslations<K> | null,
	changed: readonly K[],
	pending: readonly K[] = [],
): FieldTranslations<K> {
	return Object.fromEntries(
		TARGETS.map((t) => {
			const stored: Partial<Record<K, string>> = old?.[t] ?? {};
			const kept = Object.fromEntries(
				Object.entries(stored).filter(([k]) => !changed.includes(k as K)),
			);
			const applied = Object.fromEntries(
				Object.entries(fresh?.[t] ?? {}).filter(
					([k, v]) =>
						typeof v === "string" &&
						v.trim() !== "" &&
						(changed.includes(k as K) ||
							(pending.includes(k as K) && !stored[k as K]?.trim())),
				),
			);
			return [t, { ...kept, ...applied }];
		}),
	) as FieldTranslations<K>;
}

// Fields that lack a non-blank translation in at least one language.
export const missingFields = <K extends string>(
	t: FieldTranslations<K> | null | undefined,
	fields: readonly K[],
): K[] => fields.filter((f) => TARGETS.some((l) => !t?.[l]?.[f]?.trim()));

// A stored row: its Catalan columns plus the `translations` jsonb.
export type TranslatedRow<K extends string> = Partial<Record<K, string | null>> & {
	translations: FieldTranslations<K> | null;
};

const text = (v: string | null | undefined) => v?.trim() ?? "";

// What saving `fields` over `old` (undefined when new) needs from Azure.
// `changed`: the Catalan differs from the stored one (compared trimmed, so
// whitespace-only edits don't count); these get fresh translations, or are
// dropped if translating fails. `pending`: Catalan unchanged but untranslated
// in some language; only the gaps are filled, so hand fixes stay. A blank
// Catalan has nothing to translate: it is never pending, and it is changed
// only when it used to have text (so the old translations are dropped).
export function translationPlan<K extends string>(
	fields: Record<K, string>,
	old: TranslatedRow<K> | null | undefined,
	keys: readonly K[],
): { changed: K[]; pending: K[] } {
	const changed = keys.filter((k) => text(fields[k]) !== text(old?.[k]));
	const pending = keys.filter(
		(k) =>
			!changed.includes(k) &&
			text(fields[k]) !== "" &&
			missingFields(old?.translations, [k]).length > 0,
	);
	return { changed, pending };
}

// Translations after saving `fields` over `old`: plan, one Azure request for
// the non-blank fields that need it, merge. Never throws; if translating
// fails, changed fields are dropped and pending ones stay pending.
export async function translationsAfterSave<K extends string>(
	fields: Record<K, string>,
	old: TranslatedRow<K> | null | undefined,
	keys: readonly K[],
): Promise<FieldTranslations<K>> {
	const { changed, pending } = translationPlan(fields, old, keys);
	const todo = [...changed, ...pending].filter((k) => text(fields[k]) !== "");
	const fresh = todo.length
		? await translateFields(
				Object.fromEntries(todo.map((k) => [k, text(fields[k])])) as Partial<Record<K, string>>,
			)
		: null;
	return mergeTranslations(old?.translations, fresh, changed, pending);
}

// For translations typed in the admin: keeps only known languages and fields
// with non-blank string values (trimmed); everything else is dropped, and a
// dropped field falls back to Catalan on the site.
export function sanitizeTranslations<K extends string>(
	input: unknown,
	fields: readonly K[],
): FieldTranslations<K> {
	const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
	return Object.fromEntries(
		TARGETS.map((t) => {
			const row = (src[t] && typeof src[t] === "object" ? src[t] : {}) as Record<string, unknown>;
			return [
				t,
				Object.fromEntries(
					fields.flatMap((f) => {
						const value = row[f];
						return typeof value === "string" && value.trim() ? [[f, value.trim()]] : [];
					}),
				),
			];
		}),
	) as FieldTranslations<K>;
}

// A stored feature row.
export type FeatureRow = {
	description: string;
	translations: FieldTranslations<"description"> | null;
};

// One translation object per feature, in order; everything that needs Azure
// goes in one request. "text" pairing (saving the project, which re-creates
// the feature rows) matches each feature to a stored row by its Catalan text:
// a match keeps its translations (hand edits included) and only fills missing
// languages; a new or edited text is translated from scratch. "position"
// pairing (`old` aligned with `features`) plans each feature against its own
// row, so features sharing a text each keep their own hand fixes.
export async function featureTranslations(
	features: string[],
	old: FeatureRow[],
	pairing: "text" | "position" = "text",
): Promise<FieldTranslations<"description">[]> {
	const byText = new Map<string, FeatureRow>();
	for (const f of old) {
		const seen = byText.get(f.description);
		// With duplicate texts, prefer the fully translated row.
		if (!seen || missingFields(seen.translations, ["description"]).length > 0)
			byText.set(f.description, f);
	}
	const plans = features.map((d, i) => {
		const row = pairing === "position" ? old[i] : byText.get(d);
		return { d, row, ...translationPlan({ description: d }, row, ["description"] as const) };
	});
	const todo = [
		...new Set(plans.filter((p) => p.changed.length || p.pending.length).map((p) => p.d)),
	];
	const result = todo.length ? await translateTexts(todo) : null;
	return plans.map(({ d, row, changed, pending }) => {
		const i = todo.indexOf(d);
		const fresh =
			result && i >= 0
				? (Object.fromEntries(
						TARGETS.map((t) => [t, { description: result[t][i] }]),
					) as FieldTranslations<"description">)
				: null;
		return mergeTranslations(row?.translations, fresh, changed, pending);
	});
}
