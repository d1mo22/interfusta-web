import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";

// Shared between app/layout.tsx (the normal root layout) and
// app/global-error.tsx (which must render its own <html>/<body> and so
// can't rely on the layout's font setup).
export const bricolage = Bricolage_Grotesque({
	subsets: ["latin", "latin-ext"],
	axes: ["opsz", "wdth"],
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
