"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
	{ href: "/services", label: "Serveis" },
	{ href: "/portfolio", label: "Projectes" },
	{ href: "/about", label: "Sobre Nosaltres" },
	{ href: "/contact", label: "Contacte" },
];

const PHONE_NUMBER = "+376 804 440";
const PHONE_HREF = "tel:+376804440";

export function Navigation() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	function isActive(href: string) {
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	return (
		<header className="fixed inset-x-0 top-0 z-40 h-16 bg-paper border-b border-hairline">
			<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex items-center justify-between h-full">
				<Link href="/" aria-label="Fusteria InterFusta" className="text-ink">
					<Logo />
				</Link>

				<nav className="hidden lg:flex items-center gap-9">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
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
						aria-label={`Truca'ns al ${PHONE_NUMBER}`}
						className="flex items-center gap-1.5 text-[15px] text-ink-muted hover:text-ink transition-colors duration-150"
					>
						<Phone className="h-4 w-4" aria-hidden />
						<span className="font-mono text-sm">{PHONE_NUMBER}</span>
					</a>
					<div className="ml-3">
						<ThemeToggle />
					</div>
				</nav>

				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="lg:hidden inline-flex items-center justify-center p-2 text-ink"
					aria-label={isOpen ? "Tancar menú" : "Obrir menú"}
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
							href={link.href}
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
							aria-label={`Truca'ns al ${PHONE_NUMBER}`}
							className="flex items-center gap-1.5 text-[15px] text-ink-muted hover:text-ink transition-colors duration-150"
						>
							<Phone className="h-4 w-4" aria-hidden />
							<span className="font-mono text-sm">{PHONE_NUMBER}</span>
						</a>
						<ThemeToggle />
					</div>
				</div>
			)}
		</header>
	);
}
