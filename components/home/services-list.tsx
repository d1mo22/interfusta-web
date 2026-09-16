"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type Service = {
	title: string;
	description: string;
	image: string;
	href: string;
};

export function ServicesList({ services }: { services: Service[] }) {
	const [active, setActive] = useState(0);

	return (
		<div className="mt-12 grid lg:grid-cols-12 gap-10">
			<div className="lg:col-span-7">
				{services.map((service, index) => (
					<Link
						key={service.title}
						href={service.href}
						onMouseEnter={() => setActive(index)}
						onFocus={() => setActive(index)}
						className={`group grid grid-cols-[1fr_auto] items-center gap-6 py-6 border-b border-hairline${
							index === 0 ? " border-t" : ""
						}`}
					>
						<div className="lg:hidden col-span-2">
							<div className="relative aspect-[16/9] mb-4">
								<Image
									src={service.image}
									alt={service.title}
									fill
									sizes="100vw"
									className="object-cover"
								/>
							</div>
						</div>
						<div>
							<h3 className="font-display text-2xl md:text-3xl tracking-tight text-ink group-hover:text-brand-ink transition-colors duration-200">
								{service.title}
							</h3>
							<p className="mt-2 text-ink-muted text-sm max-w-[52ch]">
								{service.description}
							</p>
						</div>
						<ArrowUpRight className="h-6 w-6 text-ink-muted group-hover:text-brand-ink transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</Link>
				))}
				<Link href="/services" className="btn btn-secondary mt-10">
					Explorar Tots els Serveis
				</Link>
			</div>
			<div className="lg:col-span-5 hidden lg:block">
				<div className="sticky top-[96px] relative aspect-[4/5]">
					{services.map((service, index) => (
						<Image
							key={service.title}
							src={service.image}
							alt={service.title}
							fill
							sizes="40vw"
							className={`object-cover absolute inset-0 transition-opacity duration-500 ${
								index === active ? "opacity-100" : "opacity-0"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
