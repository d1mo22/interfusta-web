"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
	{ href: "/services", label: "Serveis" },
	{ href: "/portfolio", label: "Projectes" },
	{ href: "/about", label: "Sobre Nosaltres" },
	{ href: "/contact", label: "Contacte" },
];

export function Navigation() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	return (
		<nav className="fixed top-0 left-0 right-0 h-[72px] bg-paper border-b border-hairline z-50">
			<div className="container-site h-full flex items-center justify-between">
				<Link href="/" className="flex items-center" aria-label="InterFusta">
					<Logo width={130} height={44} className="text-ink" />
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center gap-8">
					{links.map((link) => {
						const isActive = pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={`relative text-sm transition-colors duration-200 ${
									isActive
										? "text-ink after:absolute after:left-0 after:-bottom-[26px] after:h-[2px] after:w-full after:bg-brand"
										: "text-ink-muted hover:text-ink"
								}`}
							>
								{link.label}
							</Link>
						);
					})}
					<ThemeToggle />
				</div>

				{/* Mobile menu button */}
				<div className="md:hidden flex items-center gap-2">
					<ThemeToggle />
					<button
						type="button"
						onClick={() => setIsOpen((open) => !open)}
						aria-expanded={isOpen}
						aria-label={isOpen ? "Tanca el menú" : "Obre el menú"}
						className="h-10 w-10 inline-flex items-center justify-center text-ink"
					>
						{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</button>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isOpen && (
				<div className="md:hidden absolute top-[72px] left-0 right-0 bg-paper border-b border-hairline menu-in">
					{links.map((link, index) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setIsOpen(false)}
							className={`block font-display text-2xl py-4 px-4 text-ink ${
								index !== links.length - 1 ? "border-b border-hairline" : ""
							}`}
						>
							{link.label}
						</Link>
					))}
				</div>
			)}
		</nav>
	);
}
