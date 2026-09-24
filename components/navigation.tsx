"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { fill, localeHref, stripLocale, type Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/i18n";

const PHONE_NUMBER = "+376 804 440";
const PHONE_HREF = "tel:+376804440";

export function Navigation({ lang, dict }: { lang: Locale; dict: Dictionary["nav"] }) {
	const [isOpen, setIsOpen] = useState(false);
	const path = stripLocale(usePathname());
	const links = [
		{ href: "/services", label: dict.services },
		{ href: "/portfolio", label: dict.portfolio },
		{ href: "/about", label: dict.about },
		{ href: "/contact", label: dict.contact },
	];
	const themeLabels = { toggle: dict.theme, light: dict.light, dark: dict.dark };
	const callLabel = fill(dict.call, { phone: PHONE_NUMBER });

	function isActive(href: string) {
		return path === href || path.startsWith(`${href}/`);
	}

	return (
		<header className="fixed inset-x-0 top-0 z-40 h-16 bg-paper border-b border-hairline">
			<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex items-center justify-between h-full">
				<Link href={localeHref(lang, "/")} aria-label="Fusteria InterFusta" className="text-ink">
					<Logo />
				</Link>

				<nav className="hidden lg:flex items-center gap-9">
					{links.map((link) => (
						<Link
							key={link.href}
							href={localeHref(lang, link.href)}
							className={
								isActive(link.href)
									? "text-[15px] text-ink underline decoration-brand decoration-2 underline-offset-[7px]"
									: "text-[15px] text-ink-muted hover:text-ink transition-colors duration-150"
							}
						>
							{link.label}
						</Link>
					))}
					<a
						href={PHONE_HREF}
						aria-label={callLabel}
						className="hidden xl:flex items-center gap-1.5 text-[15px] text-ink-muted hover:text-ink transition-colors duration-150"
					>
						<Phone className="h-3.5 w-3.5" aria-hidden />
						<span>{PHONE_NUMBER}</span>
					</a>
					<div className="ml-3 flex items-center gap-6">
						<LanguageSwitcher lang={lang} label={dict.language} />
						<ThemeToggle labels={themeLabels} />
					</div>
				</nav>

				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="lg:hidden inline-flex items-center justify-center p-2 text-ink"
					aria-label={isOpen ? dict.closeMenu : dict.openMenu}
					aria-expanded={isOpen}
				>
					{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
				</button>
			</div>

			{isOpen && (
				<div className="lg:hidden absolute inset-x-0 top-16 bg-paper border-b border-hairline divide-y divide-hairline menu-enter">
					{links.map((link) => (
						<Link
							key={link.href}
							href={localeHref(lang, link.href)}
							onClick={() => setIsOpen(false)}
							className={
								isActive(link.href)
									? "block px-6 py-4 text-[15px] text-ink underline decoration-brand decoration-2 underline-offset-[7px]"
									: "block px-6 py-4 text-[15px] text-ink-muted hover:text-ink transition-colors duration-150"
							}
						>
							{link.label}
						</Link>
					))}
					<div className="px-6 py-4 flex items-center justify-between">
						<a
							href={PHONE_HREF}
							aria-label={callLabel}
							className="flex items-center gap-1.5 text-[15px] text-ink-muted hover:text-ink transition-colors duration-150"
						>
							<Phone className="h-3.5 w-3.5" aria-hidden />
							<span>{PHONE_NUMBER}</span>
						</a>
						<ThemeToggle labels={themeLabels} />
					</div>
					<div className="px-6 py-4">
						<LanguageSwitcher lang={lang} label={dict.language} variant="list" />
					</div>
				</div>
			)}
		</header>
	);
}
