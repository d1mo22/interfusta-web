// Run: node --experimental-strip-types lib/translate.check.ts
import assert from "node:assert";
import {
	mergeTranslations,
	missingFields,
	sanitizeTranslations,
	translateFields,
	translateTexts,
	translationPlan,
	translationsAfterSave,
} from "./translate.ts";

process.env.AZURE_TRANSLATOR_KEY = "test-key";
process.env.AZURE_TRANSLATOR_REGION = "westeurope";

// Fake Azure: echoes each text prefixed with the target code, in `to` order.
let calledUrl = "";
let calls = 0;
globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
	calls++;
	calledUrl = String(url);
	const body = JSON.parse(String(init?.body)) as { text: string }[];
	const to = new URL(calledUrl).searchParams.getAll("to");
	return new Response(
		JSON.stringify(
			body.map((b) => ({ translations: to.map((t) => ({ to: t, text: `${t}:${b.text}` })) })),
		),
		{ status: 200 },
	);
}) as typeof fetch;

const out = await translateTexts(["Cuina", "Armari"]);
assert.match(calledUrl, /from=ca&to=es&to=fr&to=en&to=pt-pt$/);
assert.deepStrictEqual(out, {
	es: ["es:Cuina", "es:Armari"],
	fr: ["fr:Cuina", "fr:Armari"],
	en: ["en:Cuina", "en:Armari"],
	pt: ["pt-pt:Cuina", "pt-pt:Armari"],
});

// Blank fields are not sent; the result has the jsonb column's shape
assert.deepStrictEqual(await translateFields({ title: "Cuina", duration: "  " }), {
	es: { title: "es:Cuina" },
	fr: { title: "fr:Cuina" },
	en: { title: "en:Cuina" },
	pt: { title: "pt-pt:Cuina" },
});

// Nothing to translate: no request at all
calls = 0;
assert.deepStrictEqual(await translateTexts([]), { es: [], fr: [], en: [], pt: [] });
assert.equal(calls, 0);

// Free quota used up (403) or a network error -> null, never a throw
globalThis.fetch = (async () => new Response('{"error":{"code":403001}}', { status: 403 })) as typeof fetch;
assert.equal(await translateTexts(["x"]), null);
assert.equal(await translateFields({ title: "x" }), null);
globalThis.fetch = (async () => {
	throw new TypeError("fetch failed");
}) as typeof fetch;
assert.equal(await translateTexts(["x"]), null);

// Not configured -> null
delete process.env.AZURE_TRANSLATOR_KEY;
assert.equal(await translateTexts(["x"]), null);

// Every field blank or undefined: no request, an empty object per language
// (and no Azure config needed, since the key was deleted above)
assert.deepStrictEqual(await translateFields<"title" | "duration">({ title: " ", duration: undefined }), {
	es: {},
	fr: {},
	en: {},
	pt: {},
});

const every = (v: Record<string, string>) => ({ es: v, fr: v, en: v, pt: v });

// Only changed fields are replaced; a hand-fixed description survives a title edit
assert.deepStrictEqual(
	mergeTranslations(
		every({ title: "Cocina vieja", description: "Arreglado a mano" }),
		every({ title: "Cocina nueva" }),
		["title"],
	),
	every({ title: "Cocina nueva", description: "Arreglado a mano" }),
);
// Translation failed: the changed field is dropped so the site shows the new Catalan, not stale text
assert.deepStrictEqual(
	mergeTranslations(every({ title: "Cocina vieja", description: "Arreglado a mano" }), null, ["title"]),
	every({ description: "Arreglado a mano" }),
);
// Nothing stored and nothing translated
assert.deepStrictEqual(mergeTranslations(null, null, ["title"]), every({}));

// Pending field (Catalan unchanged, some languages untranslated): only the blank languages are filled
assert.deepStrictEqual(
	mergeTranslations(
		{ es: { title: "Arreglado a mano" }, fr: { title: " " }, en: { title: "Kitchen" }, pt: {} },
		every({ title: "Nuevo" }),
		[],
		["title"],
	),
	{ es: { title: "Arreglado a mano" }, fr: { title: "Nuevo" }, en: { title: "Kitchen" }, pt: { title: "Nuevo" } },
);
// Pending field and translation failed: stored values are left as they were
assert.deepStrictEqual(
	mergeTranslations(every({ title: "Arreglado a mano" }), null, [], ["title"]),
	every({ title: "Arreglado a mano" }),
);
// A fresh field in neither list is ignored
assert.deepStrictEqual(
	mergeTranslations(
		every({ title: "Viejo", description: "Arreglado a mano" }),
		every({ title: "Nuevo", description: "Máquina", duration: "3 días" }),
		["title"],
	),
	every({ title: "Nuevo", description: "Arreglado a mano" }),
);

// Blank or whitespace-only fresh values are never stored: a changed field is
// dropped (Catalan shows) and a pending blank language stays unfilled
assert.deepStrictEqual(
	mergeTranslations(
		{ es: { title: "Viejo", description: "" }, fr: {}, en: {}, pt: {} },
		{ es: { title: "  ", description: "" }, fr: { title: "" }, en: { title: "New" }, pt: { title: " \n" } },
		["title"],
		["description"],
	),
	{ es: { description: "" }, fr: {}, en: { title: "New" }, pt: {} },
);

// missingFields treats blanks and absent languages as missing
assert.deepStrictEqual(
	missingFields(every({ title: "x", description: " " }), ["title", "description"]),
	["description"],
);
assert.deepStrictEqual(missingFields({ es: { title: "x" } }, ["title"]), ["title"]);
assert.deepStrictEqual(missingFields(null, ["title"]), ["title"]);
assert.deepStrictEqual(missingFields(every({ title: "x" }), ["title"]), []);

// sanitizeTranslations: the admin's trust boundary
assert.deepStrictEqual(
	sanitizeTranslations(
		{
			es: { title: " Hola ", evil: "x", description: 5 },
			de: { title: "Hallo" },
			fr: "nope",
			en: { title: "   " },
		},
		["title", "description"],
	),
	{ es: { title: "Hola" }, fr: {}, en: {}, pt: {} },
);
assert.deepStrictEqual(sanitizeTranslations(null, ["title"]), every({}));

// translationPlan: what a save needs from Azure
const F = ["title", "description", "duration"] as const;
const cat = { title: "Cuina", description: "Nova", duration: "2 dies" };
// No stored row: every non-blank field is changed, a blank one is skipped
assert.deepStrictEqual(translationPlan({ ...cat, duration: " " }, undefined, F), {
	changed: ["title", "description"],
	pending: [],
});
// A changed field; whitespace-only edits don't count as changes
assert.deepStrictEqual(
	translationPlan(
		{ title: "Cuina nova", description: " Nova\n", duration: "2 dies" },
		{ ...cat, translations: every({ title: "a", description: "b", duration: "c" }) },
		F,
	),
	{ changed: ["title"], pending: [] },
);
// A pending-only field: Catalan unchanged, one language missing
assert.deepStrictEqual(
	translationPlan(cat, { ...cat, translations: { ...every({ title: "a", description: "b", duration: "c" }), fr: { title: "a", duration: "c" } } }, F),
	{ changed: [], pending: ["description"] },
);
// Changed and pending in one call; the lists never overlap (changed wins)
assert.deepStrictEqual(
	translationPlan({ ...cat, title: "Armari" }, { ...cat, translations: { es: { title: "a" } } }, F),
	{ changed: ["title"], pending: ["description", "duration"] },
);
// A blank Catalan is never pending; it is changed only when it used to have text
assert.deepStrictEqual(
	translationPlan({ ...cat, duration: "" }, { ...cat, duration: " ", translations: null }, F),
	{ changed: [], pending: ["title", "description"] },
);
assert.deepStrictEqual(
	translationPlan({ ...cat, duration: "" }, { ...cat, translations: every({ title: "a", description: "b", duration: "c" }) }, F),
	{ changed: ["duration"], pending: [] },
);
// A key in both lists of mergeTranslations is treated as changed (replaced, not gap-filled)
assert.deepStrictEqual(
	mergeTranslations(every({ title: "A mano" }), every({ title: "Máquina" }), ["title"], ["title"]),
	every({ title: "Máquina" }),
);
assert.deepStrictEqual(
	mergeTranslations(every({ title: "A mano" }), null, ["title"], ["title"]),
	every({}),
);

// translationsAfterSave: plan -> one request for the non-blank fields -> merge
process.env.AZURE_TRANSLATOR_KEY = "test-key";
let sent: string[] = [];
globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
	calls++;
	const body = JSON.parse(String(init?.body)) as { text: string }[];
	sent = body.map((b) => b.text);
	return new Response(
		JSON.stringify(body.map((b) => ({ translations: ["es", "fr", "en", "pt"].map((t) => ({ text: `${t}:${b.text}` })) }))),
		{ status: 200 },
	);
}) as typeof fetch;
// Changed title and pending description in one call; the hand-fixed Spanish description stays
calls = 0;
assert.deepStrictEqual(
	await translationsAfterSave(
		{ title: " Armari ", description: "Nova", duration: "" },
		{ title: "Cuina", description: "Nova", duration: "", translations: { es: { title: "Cocina", description: "A mano" } } },
		F,
	),
	{
		es: { title: "es:Armari", description: "A mano" },
		fr: { title: "fr:Armari", description: "fr:Nova" },
		en: { title: "en:Armari", description: "en:Nova" },
		pt: { title: "pt:Armari", description: "pt:Nova" },
	},
);
assert.equal(calls, 1);
assert.deepStrictEqual(sent, ["Armari", "Nova"]);
// Nothing to do (unchanged, fully translated, blank duration): no request
calls = 0;
const done = every({ title: "a", description: "b" });
assert.deepStrictEqual(
	await translationsAfterSave({ title: "Cuina", description: "Nova", duration: " " }, { title: "Cuina", description: "Nova", duration: "", translations: done }, F),
	done,
);
assert.equal(calls, 0);
// Changed field with translation failed (fresh = null): dropped so the new Catalan shows; pending stays
globalThis.fetch = (async () => new Response("", { status: 403 })) as typeof fetch;
assert.deepStrictEqual(
	await translationsAfterSave(
		{ title: "Armari", description: "Nova", duration: "" },
		{ title: "Cuina", description: "Nova", duration: "", translations: { es: { title: "Cocina", description: "A mano" } } },
		F,
	),
	{ es: { description: "A mano" }, fr: {}, en: {}, pt: {} },
);

console.log("translate ok");
