"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
	LANGUAGE_NAMES,
	LOCALE_COOKIE,
	locales,
	localeHref,
	stripLocale,
	type Locale,
} from "@/lib/i18n-config";

// "dropdown": the desktop header's "CA ▾" menu. "list": the mobile menu's
// always-open list of names.
export function LanguageSwitcher({
	lang,
	label,
	variant = "dropdown",
}: {
	lang: Locale;
	label: string;
	variant?: "dropdown" | "list";
}) {
	const path = stripLocale(usePathname());
	const id = useId();
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		if (!open) return;
		menuRef.current?.querySelector<HTMLAnchorElement>("a[aria-current]")?.focus();
		function onPointerDown(event: PointerEvent) {
			if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
		}
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [open]);

	function onKeyDown(event: React.KeyboardEvent) {
		if (event.key === "Escape" && open) {
			setOpen(false);
			buttonRef.current?.focus();
		} else if (open && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
			const items = [...(menuRef.current?.querySelectorAll("a") ?? [])];
			const i = items.indexOf(document.activeElement as HTMLAnchorElement);
			event.preventDefault();
			if (event.key === "Home") items[0].focus();
			else if (event.key === "End") items[items.length - 1].focus();
			// From the button, the arrows enter the list at the current language.
			else if (i === -1) menuRef.current?.querySelector<HTMLAnchorElement>("a[aria-current]")?.focus();
			else items[(i + (event.key === "ArrowDown" ? 1 : items.length - 1)) % items.length].focus();
		}
	}

	function onBlur(event: React.FocusEvent) {
		// A null relatedTarget (a click on nothing focusable, or Safari not focusing
		// links on mousedown) is left to the pointerdown listener.
		const next = event.relatedTarget;
		if (next && !rootRef.current?.contains(next)) setOpen(false);
	}

	function item(l: Locale, className: string) {
		return (
			// A plain <a>, not <Link>: the full page load re-runs ThemeScript, so dark mode survives the switch.
			<a
				href={localeHref(l, path)}
				hrefLang={l}
				lang={l}
				aria-current={l === lang ? "true" : undefined}
				onClick={() => {
					// Set before navigating: the proxy trusts this cookie over Accept-Language.
					document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
				}}
				className={`group flex items-center justify-between gap-4 ${className}`}
			>
				<span>{LANGUAGE_NAMES[l]}</span>
				<span className="font-mono text-xs text-ink-muted group-aria-[current=true]:text-brand">
					{l.toUpperCase()}
				</span>
			</a>
		);
	}

	if (variant === "list") {
		return (
			<nav aria-labelledby={id}>
				<p id={id} className="mb-1.5 font-mono text-xs uppercase tracking-[.02em] text-ink-muted">
					{label}
				</p>
				<ul className="grid gap-0.5">
					{locales.map((l) => (
						<li key={l}>
							{item(
								l,
								"py-1.5 text-[15px] text-ink-muted hover:text-ink aria-[current=true]:text-ink aria-[current=true]:font-medium",
							)}
						</li>
					))}
				</ul>
			</nav>
		);
	}

	return (
		<div ref={rootRef} className="relative" onKeyDown={onKeyDown} onBlur={onBlur}>
			<button
				ref={buttonRef}
				type="button"
				// Starts with the visible code so the name contains the label (WCAG 2.5.3).
				aria-label={`${lang.toUpperCase()}, ${label}: ${LANGUAGE_NAMES[lang]}`}
				aria-expanded={open}
				aria-controls={id}
				onClick={() => setOpen(!open)}
				className="group inline-flex items-center gap-1.5 py-1 font-mono text-[13px] tracking-[.02em] text-ink"
			>
				{lang.toUpperCase()}
				<ChevronDown
					aria-hidden
					className="size-3 transition-transform duration-150 ease-out group-aria-expanded:rotate-180"
				/>
			</button>
			<ul
				ref={menuRef}
				id={id}
				hidden={!open}
				className="picker-enter absolute -right-3 top-[calc(100%+12px)] z-50 grid min-w-[196px] gap-0.5 rounded-md border border-hairline bg-paper p-1.5 shadow-[0_10px_30px_rgba(23,22,20,0.12),0_1px_3px_rgba(23,22,20,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.4)]"
			>
				{locales.map((l) => (
					<li key={l}>
						{item(
							l,
							"rounded px-2.5 py-2 text-[15px] text-ink hover:bg-stone focus-visible:bg-stone focus-visible:outline-none aria-[current=true]:font-medium",
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
