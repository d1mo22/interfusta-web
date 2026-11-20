// Adds .dark to <html> when the saved theme (localStorage "theme", else the
// OS preference) is dark. Self-contained on purpose: ThemeScript inlines its
// source, so it can't reference anything outside its own body.
// Keep to plain ES2019 syntax (no ?. or ??): its compiled source is inlined verbatim into the page.
export function applySavedTheme() {
	try {
		const t = localStorage.getItem("theme");
		if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches))
			document.documentElement.classList.add("dark");
	} catch {}
}

// Fixed script, no user data: runs before paint so dark mode doesn't flash.
const THEME_SCRIPT = `(${applySavedTheme.toString()})()`;

export function ThemeScript() {
	return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
