// Run: node --experimental-strip-types lib/translate.check.ts
import assert from "node:assert";
import { translateFields, translateTexts } from "./translate.ts";

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

console.log("translate ok");
