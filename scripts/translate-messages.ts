// Drafts messages/{es,fr,en,pt}.json from messages/ca.json with Azure Translator.
// Strings already present in a target file are kept, so hand fixes survive
// re-runs and a second run with nothing new makes no API call.
// Run: node --experimental-strip-types --env-file=.env.local scripts/translate-messages.ts
import { readFileSync, writeFileSync } from "node:fs";
import { TARGETS } from "../lib/i18n-config.ts";
import { translateTexts } from "../lib/translate.ts";

type Json = string | Json[] | { [key: string]: Json };

const read = (lang: string): Json | undefined => {
	try {
		return JSON.parse(readFileSync(`messages/${lang}.json`, "utf8"));
	} catch {
		return undefined;
	}
};

// Every string leaf with its path, e.g. [["home","services","0","title"], "Mobles a mesura"].
const leaves = (node: Json, path: string[] = []): [string[], string][] =>
	typeof node === "string"
		? [[path, node]]
		: Object.entries(node).flatMap(([k, v]) => leaves(v, [...path, k]));

const get = (node: Json | undefined, path: string[]) =>
	path.reduce<Json | undefined>(
		(n, k) => (n && typeof n === "object" ? (n as Record<string, Json>)[k] : undefined),
		node,
	);

const set = (root: Json, path: string[], value: string) => {
	const parent = path.slice(0, -1).reduce((n, k) => (n as Record<string, Json>)[k], root);
	(parent as Record<string, Json>)[path[path.length - 1]] = value;
};

// The *accent* markers and {placeholders} must survive translation.
const markers = (s: string) => [...s.matchAll(/\{\w+\}|\*/g)].map((m) => m[0]).sort().join(" ");

const ca = read("ca");
if (!ca) throw new Error("messages/ca.json not found");
const files = Object.fromEntries(TARGETS.map((l) => [l, read(l)]));
const all = leaves(ca);
const missing = all.filter(([path]) => TARGETS.some((l) => typeof get(files[l], path) !== "string"));

// ponytail: at most 100 strings and 5,000 source characters per request, far
// below Azure's per-request caps even though each request has 4 targets.
const batches: string[][] = [];
let batch: string[] = [];
let size = 0;
for (const [, text] of missing) {
	if (batch.length && (batch.length === 100 || size + text.length > 5000)) {
		batches.push(batch);
		batch = [];
		size = 0;
	}
	batch.push(text);
	size += text.length;
}
if (batch.length) batches.push(batch);

const fresh = Object.fromEntries(TARGETS.map((l) => [l, [] as string[]]));
for (const texts of batches) {
	const result = await translateTexts(texts);
	if (!result) throw new Error("Azure Translator failed; no file was written");
	for (const l of TARGETS) fresh[l].push(...result[l]);
}

let warnings = 0;
for (const lang of TARGETS) {
	const out = structuredClone(ca); // same shape as Catalan; every leaf gets replaced below
	for (const [path, text] of all) {
		const existing = get(files[lang], path);
		const value =
			typeof existing === "string" ? existing : fresh[lang][missing.findIndex(([p]) => p === path)];
		if (markers(value) !== markers(text)) {
			warnings++;
			console.warn(`${lang}: ${path.join(".")} lost its * or {…} markers → fix by hand:\n  ca: ${text}\n  ${lang}: ${value}`);
		}
		set(out, path, value);
	}
	writeFileSync(`messages/${lang}.json`, `${JSON.stringify(out, null, "\t")}\n`);
}
console.log(`${missing.length} strings translated in ${batches.length} requests, ${warnings} to fix by hand`);
