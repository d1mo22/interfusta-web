import localFont from "next/font/local";

// Shared between app/layout.tsx (the normal root layout) and
// app/global-error.tsx (which must render its own <html>/<body> and so
// can't rely on the layout's font setup).
//
// Bricolage Grotesque (the display font) isn't loaded here - see
// components/bricolage-font-links.tsx for why (Vercel preview protection
// breaks a same-origin self-hosted font's CORS fetch, and next/font/google's
// build-time fetch is unreliable under Turbopack). It's fetched at runtime
// from Google Fonts via a <link> in both HTML shells instead.

export const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
});

export const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
});
