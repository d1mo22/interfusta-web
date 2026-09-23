"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/app/actions/auth";

const links = [
	{ href: "/admin", label: "Projectes", match: (p: string) => !p.startsWith("/admin/categories") },
	{ href: "/admin/categories", label: "Categories", match: (p: string) => p.startsWith("/admin/categories") },
];

export function AdminNav() {
	const pathname = usePathname();

	return (
		<header className="border-b border-hairline">
			<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-wrap items-center gap-x-9 text-[15px]">
				<Link href="/admin" aria-label="Panell d'InterFusta" className="h-16 flex items-center gap-3 text-ink">
					<Logo />
					<span className="font-mono text-[13px] text-ink-muted border-l border-hairline pl-3">
						Panell
					</span>
				</Link>

				{/* Phones: tabs drop to their own row under the logo. */}
				<nav
					aria-label="Administració"
					className="order-last w-full sm:order-none sm:w-auto flex gap-7 h-12 sm:h-16 items-center border-t border-hairline sm:border-0"
				>
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							aria-current={link.match(pathname) ? "page" : undefined}
							className={
								link.match(pathname)
									? "text-ink underline decoration-brand decoration-2 underline-offset-[7px]"
									: "text-ink-muted hover:text-ink transition-colors duration-150"
							}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="ml-auto flex items-center gap-6">
					<a
						href="/"
						target="_blank"
						rel="noreferrer"
						className="hidden md:inline-flex items-center gap-1 text-ink-muted hover:text-ink transition-colors duration-150"
					>
						Veure la web <ArrowUpRight className="size-4" />
					</a>
					<span className="hidden md:inline">
						<ThemeToggle />
					</span>
					<form action={logout}>
						<button
							type="submit"
							className="text-ink-muted hover:text-ink transition-colors duration-150"
						>
							Surt
						</button>
					</form>
				</div>
			</div>
		</header>
	);
}
