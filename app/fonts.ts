import localFont from "next/font/local";

// Shared between components/html-shell.tsx (used by both root layouts,
// app/[lang] and app/(admin)) and app/global-error.tsx (which must render
// its own <html>/<body> and so can't rely on a layout's font setup).
//
// All three are self-hosted: next/font/google's build-time fetch is flaky
// under Turbopack. The .variable classes must sit on <html>, where Tailwind's
// @theme declares --font-display/--font-sans/--font-mono (see 418b7bf).

// Variable font, latin subset. The weight range must be declared or the
// browser fakes semibold by smearing the 400 master; wdth is set in CSS
// via font-variation-settings.
export const bricolage = localFont({
	src: "./fonts/BricolageGrotesqueVF.woff2",
	weight: "200 800",
	variable: "--font-bricolage",
	display: "swap",
});

export const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
});

export const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
});
