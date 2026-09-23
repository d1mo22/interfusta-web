"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
	const [isDark, setIsDark] = useState<boolean | null>(null);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- reads DOM state unavailable during SSR
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);

	function toggle() {
		const next = !isDark;
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("theme", next ? "dark" : "light");
		setIsDark(next);
	}

	return (
		<button
			type="button"
			aria-label="Canviar tema"
			onClick={toggle}
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
