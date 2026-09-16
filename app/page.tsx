"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Grain } from "@/components/grain";
import featuredProject from "@/data/featured-project.json";
import { ImageGalleryModal } from "@/components/image-gallery-modal";

const services = [
	{
		title: "Mobles a mesura",
		description:
			"Mobles personalitzats dissenyats i fabricats segons les seves especificacions",
		image: "/Medida-2.webp",
		alt: "Mobles a mesura al taller",
	},
	{
		title: "Instal·lació de cuines",
		description:
			"Instal·lació professional de gabinets de cuina i personalització",
		image: "/Cuina-2.webp",
		alt: "Instal·lació de cuines",
	},
	{
		title: "Lacatge i vernissat",
		description:
			"Acabats professionals per a protegir i embellir els seus mobles de fusta",
		image: "/Laca-1.webp",
		alt: "Lacatge i vernissat",
	},
	{
		title: "Mesuraments i planificació",
		description:
			"Planificació detallada i mesuraments precisos per al seu projecte",
		image: "/Planificacio-1.webp",
		alt: "Mesuraments i planificació",
	},
];

export default function Home() {
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [activeService, setActiveService] = useState(0);

	const openGallery = (index: number) => {
		setSelectedImageIndex(index);
		setIsGalleryOpen(true);
	};

	return (
		<div className="bg-paper text-ink">
			<Grain />

			{/* Hero */}
			<section className="relative min-h-[100dvh] overflow-hidden bg-[#141312]">
				<video
					autoPlay
					muted
					loop
					playsInline
					preload="auto"
					className="absolute inset-0 h-full w-full object-cover"
					poster="/thumbnail.webp"
				>
					<source src="/video.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-[rgba(23,22,20,.34)]" />
				<div className="absolute inset-x-0 bottom-[88px]">
					<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 text-[#F6F5F2]">
						<div className="flex flex-col gap-7 max-w-[900px] motion-rise">
							<span className="font-mono text-[13px] tracking-[.02em] font-medium text-brand motion-rise [animation-delay:0ms]">
								Fusteria a Santa Coloma, Andorra
							</span>
							<h1 className="h-page text-[#F6F5F2] motion-rise [animation-delay:60ms]">
								Serveis experts de{" "}
								<span className="text-brand">fusteria</span> a Andorra
							</h1>
							<p className="text-[21px] max-w-[44ch] opacity-90 motion-rise [animation-delay:120ms]">
								Creant solucions de fusta elegants i funcionals per a la seva
								llar i negoci
							</p>
						</div>
						<Link
							href="/portfolio"
							className="btn-press inline-flex h-[54px] items-center px-[30px] bg-brand text-[#F6F5F2] font-medium rounded-none hover:bg-brand-ink motion-rise [animation-delay:180ms]"
						>
							Veure el nostre treball
						</Link>
					</div>
				</div>
			</section>

			{/* Featured project */}
			<section className="bg-stone pt-28 pb-32">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid lg:grid-cols-[8fr_4fr] items-end">
					<div className="relative aspect-[4/3] w-full">
						<Image
							src={featuredProject.image.url}
							alt={featuredProject.image.alt}
							fill
							className="object-cover"
							sizes="(min-width: 1024px) 66vw, 100vw"
						/>
					</div>
					<div className="bg-paper p-12 pb-0 lg:-ml-40 lg:-mb-16 relative z-[2] flex flex-col gap-6">
						<span className="text-sm text-ink-muted">Projecte destacat</span>
						<h2 className="h-display text-[44px]">
							Renovació d&apos;una <span className="text-brand">vila</span> de
							luxe
						</h2>
						<p className="text-ink-muted">{featuredProject.description}</p>
						<ul className="border-b border-hairline">
							{featuredProject.features.map((feature: string) => (
								<li
									key={feature}
									className="py-3.5 border-t border-hairline first:border-t-0"
								>
									{feature}
								</li>
							))}
						</ul>
						<div className="grid grid-cols-4 gap-2.5">
							{featuredProject.gallery.map((image, index) => (
								<button
									type="button"
									key={image.url}
									onClick={() => openGallery(index)}
									className="relative aspect-[4/3] overflow-hidden"
								>
									<Image
										src={image.url}
										alt={image.alt}
										fill
										className="object-cover md:[@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02] transition-transform duration-[400ms] ease-out"
										sizes="(min-width: 1024px) 15vw, 25vw"
									/>
								</button>
							))}
						</div>
						<Link
							href="/portfolio"
							className="self-start pb-12 underline decoration-brand decoration-2 underline-offset-[6px] font-medium hover:text-brand-ink"
						>
							Veure tots els projectes
						</Link>
					</div>
				</div>
				<ImageGalleryModal
					images={featuredProject.gallery.map((img) => img.url)}
					initialIndex={selectedImageIndex}
					isOpen={isGalleryOpen}
					onClose={() => setIsGalleryOpen(false)}
				/>
			</section>

			{/* Services */}
			<section className="pt-32 pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col gap-16">
					<div className="flex flex-col gap-6">
						<h2 className="h-page text-[80px]">
							Els nostres <span className="text-brand">serveis</span>
						</h2>
						<span className="rule" />
					</div>
					<div className="grid lg:grid-cols-[5fr_7fr] gap-24 items-start">
						<div className="flex flex-col">
							{services.map((service, index) => {
								const isActive = index === activeService;
								return (
									<Fragment key={service.title}>
										<button
											type="button"
											onMouseEnter={() => setActiveService(index)}
											onFocus={() => setActiveService(index)}
											className="w-full text-left grid grid-cols-[1fr_auto] gap-6 py-[30px] border-t border-hairline first:border-t-0"
										>
											<div className="flex flex-col gap-2">
												<h3
													className={`h-display text-4xl ${
														isActive ? "text-ink" : "text-ink-muted"
													}`}
												>
													{service.title}
												</h3>
												<p className="text-ink-muted max-w-[44ch]">
													{service.description}
												</p>
											</div>
											<span
												className={`mt-3.5 h-3.5 w-3.5 border ${
													isActive
														? "bg-brand border-brand"
														: "border-hairline"
												}`}
											/>
										</button>
										<div className="lg:hidden relative aspect-[4/3] mb-6">
											<Image
												src={service.image}
												alt={service.alt}
												fill
												className="object-cover"
												sizes="100vw"
											/>
										</div>
									</Fragment>
								);
							})}
						</div>
						<div className="hidden lg:block relative aspect-[4/3]">
							{services.map((service, index) => (
								<Image
									key={service.image}
									src={service.image}
									alt={service.alt}
									fill
									className={`object-cover transition-[opacity,filter] duration-200 ${
										index === activeService
											? "opacity-100"
											: "opacity-0 blur-[2px]"
									}`}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA band */}
			<section className="bg-brand text-[#F6F5F2] pt-28 pb-[120px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid lg:grid-cols-[8fr_4fr] items-end gap-16">
					<div className="flex flex-col gap-6">
						<h2 className="h-page text-[88px] text-[#F6F5F2]">
							Llest per començar el teu projecte?
						</h2>
						<p className="text-xl max-w-[50ch] opacity-90">
							Fem realitat la teva visió. Contacta&apos;ns avui per a una
							consulta i pressupost gratuït.
						</p>
					</div>
					<Link
						href="/contact"
						className="btn-press inline-flex h-[54px] items-center px-[30px] bg-[#F6F5F2] text-[#171614] font-medium rounded-none hover:text-brand-ink lg:justify-self-end"
					>
						Contacte
					</Link>
				</div>
			</section>
		</div>
	);
}
