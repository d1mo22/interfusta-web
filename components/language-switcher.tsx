"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LANGUAGE_NAMES,
	LOCALE_COOKIE,
	locales,
	localeHref,
	stripLocale,
	type Locale,
} from "@/lib/i18n-config";

export function LanguageSwitcher({ lang, label }: { lang: Locale; label: string }) {
	const path = stripLocale(usePathname());
	return (
		<nav aria-label={label} className="flex gap-2.5 font-mono text-[13px] tracking-[.02em]">
			{locales.map((l) => (
				<Link
					key={l}
					href={localeHref(l, path)}
					// A prefetch made while the old cookie is still set would cache the
					// proxy's redirect back to the old language.
					prefetch={false}
					hrefLang={l}
					lang={l}
					aria-label={LANGUAGE_NAMES[l]}
					aria-current={l === lang ? "true" : undefined}
					onClick={() => {
						// Set before navigating: the proxy trusts this cookie over Accept-Language.
						document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
					}}
					className={l === lang ? "text-ink" : "text-ink-muted hover:text-ink"}
				>
					{l.toUpperCase()}
				</Link>
			))}
		</nav>
	);
}
