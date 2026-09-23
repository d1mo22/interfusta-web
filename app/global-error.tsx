"use client";

import { useEffect } from "react";
import { ServerError } from "@/components/server-error";
import { ThemeScript } from "@/components/theme-script";
import { bricolage, geistSans, geistMono } from "./fonts";
import "./globals.css";

// Next.js requires global-error.tsx to render its own <html>/<body>: it
// replaces the root layout entirely when a render error escapes every
// nested error boundary, so it can't rely on app/layout.tsx for fonts,
// tokens, Navigation or Footer.
export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<html
			lang="ca"
			suppressHydrationWarning
			className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable}`}
		>
			<head>
				<ThemeScript />
			</head>
			<body className="font-sans bg-paper text-ink">
				<section className="pt-[104px] pb-[120px] min-h-dvh flex items-center">
					<div className="max-w-[1280px] mx-auto px-6 lg:px-20 w-full">
						<ServerError reset={reset} />
					</div>
				</section>
			</body>
		</html>
	);
}
