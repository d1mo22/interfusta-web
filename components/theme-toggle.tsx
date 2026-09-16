"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
	const [isDark, setIsDark] = useState<boolean | null>(null);

	useEffect(() => {
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);

	function toggleTheme() {
		const next = !isDark;
		setIsDark(next);
		document.documentElement.classList.toggle("dark", next);
		try {
			localStorage.setItem("theme", next ? "dark" : "light");
		} catch {
			// ignore storage errors
		}
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label="Canviar tema"
			className="font-mono text-[13px] tracking-[.02em]"
		>
			<span className={isDark === false ? "text-ink" : "text-ink-muted"}>
				Clar
			</span>
			<span className="text-ink-muted">/</span>
			<span className={isDark === true ? "text-ink" : "text-ink-muted"}>
				Fosc
			</span>
		</button>
	);
}
