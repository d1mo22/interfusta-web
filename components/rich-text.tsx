import { createElement, Fragment, type ReactNode } from "react";

// Renders "Escriu-nos a {email}." with each {slot} replaced by a React node,
// so a translated sentence can put its links wherever its grammar wants them.
// Unknown slots stay visible as text, like fill().
export function RichText({ text, slots }: { text: string; slots: Record<string, ReactNode> }) {
	const parts = text.split(/\{(\w+)\}/); // odd indexes are slot names
	// Passed as separate children rather than an array, so React needs no keys.
	return createElement(
		Fragment,
		null,
		...parts.map((part, i) => (i % 2 === 0 ? part : part in slots ? slots[part] : `{${part}}`)),
	);
}
