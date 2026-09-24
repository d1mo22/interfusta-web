"use client";

import { useLayoutEffect } from "react";
import { applySavedTheme } from "@/components/theme-script";

// 404s reach the browser as Next's error shell (<html id="__next_error__">):
// notFound() fails the server render, and React then renders the root layout
// on the client, where the inline ThemeScript never executes. This applies
// the same logic before the not-found UI is painted.
export function ApplyTheme() {
	useLayoutEffect(applySavedTheme, []);
	return null;
}
