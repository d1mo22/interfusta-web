"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navigation() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="bg-white shadow-sm fixed w-full z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link href="/" className="text-xl font-bold text-gray-800">
							<Image
								src="/InterFusta-logo.svg"
								alt="InterFusta Logo"
								width={150}
								height={50}
								className="object-contain"
								priority
							/>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						<Link
							href="/services"
							className="text-gray-600 hover:text-gray-900"
						>
							Servicios
						</Link>
						<Link
							href="/portfolio"
							className="text-gray-600 hover:text-gray-900"
						>
							Proyectos
						</Link>
						<Link href="/about" className="text-gray-600 hover:text-gray-900">
							Sobre Nosotros
						</Link>
						<Link href="/contact" className="text-gray-600 hover:text-gray-900">
							Contacto
						</Link>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center">
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
						>
							{isOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						<Link
							href="/services"
							className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							onClick={() => setIsOpen(false)}
						>
							Servicios
						</Link>
						<Link
							href="/portfolio"
							className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							onClick={() => setIsOpen(false)}
						>
							Proyectos
						</Link>
						<Link
							href="/about"
							className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							onClick={() => setIsOpen(false)}
						>
							Sobre Nosotros
						</Link>
						<Link
							href="/contact"
							className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							onClick={() => setIsOpen(false)}
						>
							Contacto
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}
