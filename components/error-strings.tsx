"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n-config";
import type { ServerErrorLabels } from "@/components/server-error";

// error.tsx is a client boundary that only receives { error, reset }, so the
// site layout hands it the translated copy through context.
export type ErrorStrings = ServerErrorLabels & { lang: Locale };

const ErrorStringsContext = createContext<ErrorStrings | null>(null);

export function ErrorStringsProvider({
	value,
	children,
}: {
	value: ErrorStrings;
	children: React.ReactNode;
}) {
	return <ErrorStringsContext.Provider value={value}>{children}</ErrorStringsContext.Provider>;
}

export function useErrorStrings(): ErrorStrings {
	const value = useContext(ErrorStringsContext);
	if (!value) throw new Error("useErrorStrings outside ErrorStringsProvider");
	return value;
}
