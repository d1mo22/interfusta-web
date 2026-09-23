"use client";

export function ThemeToggle() {
	function toggle() {
		const next = !document.documentElement.classList.contains("dark");
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("theme", next ? "dark" : "light");
	}

	// ThemeScript sets .dark on <html> before first paint, so the dark: variant
	// highlights the right label on the server-rendered HTML with no flash.
	return (
		<button
			type="button"
			aria-label="Canviar tema"
			onClick={toggle}
			className="font-mono text-[13px] tracking-[.02em]"
		>
			<span className="text-ink dark:text-ink-muted">Clar</span>
			<span className="text-ink-muted">/</span>
			<span className="text-ink-muted dark:text-ink">Fosc</span>
		</button>
	);
}
