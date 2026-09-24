import { ThemeScript } from "@/components/theme-script";
import { NotFoundContent } from "@/components/not-found-content";
import { bricolage, geistSans, geistMono } from "./fonts";
import ca from "@/messages/ca.json";
import "./globals.css";

// Next.js renders this for any URL that matches no route at all (the flag is
// set in next.config.mjs). It bypasses every layout — including both root
// layouts, app/[lang] and app/(admin) — so it can't read the [lang] root
// param or rely on app/[lang]/layout.tsx for fonts/tokens. Catalan only: the
// controller ruling for Task 5 says junk paths (no locale in the URL) get the
// site's own 404 in Catalan, not Next's bare built-in page.
export const metadata = {
	title: ca.notFound.metaTitle,
};

export default function GlobalNotFound() {
	return (
		<html
			lang="ca"
			suppressHydrationWarning
			className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable}`}
		>
			<head>
				<ThemeScript />
			</head>
			<body className="font-sans">
				<NotFoundContent lang="ca" dict={ca} />
			</body>
		</html>
	);
}
