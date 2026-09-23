import localFont from "next/font/local";

// Shared between app/layout.tsx (the normal root layout) and
// app/global-error.tsx (which must render its own <html>/<body> and so
// can't rely on the layout's font setup).
//
// Self-hosted rather than next/font/google: Turbopack's Google Fonts
// fetch is unreliable in Next.js 16 (open upstream issues, e.g.
// vercel/next.js#92671, #91653, #78472) and silently falls back to
// the metric-matched fallback face when it fails, with no build
// error. This is the variable font's "latin" subset (covers Catalan/
// Spanish/English; the "latin-ext"/Vietnamese subsets Google served
// alongside it aren't needed for this site's content), still exposing
// the opsz/wght/wdth axes the CSS uses via font-variation-settings.
export const bricolage = localFont({
	src: "./fonts/BricolageGrotesqueVF.woff2",
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
