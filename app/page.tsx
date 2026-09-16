import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { FeaturedGallery } from "@/components/home/featured-gallery";
import { ServicesList } from "@/components/home/services-list";
import featuredProject from "@/data/featured-project.json";

export const metadata = {
	title: { absolute: "Fusteria InterFusta - Serveis experts de fusteria a Andorra" },
	description:
		"Fusteria i ebenisteria a Andorra: mobles a mesura, cuines, lacatge i vernissat, estructures de fusta i restauració per a la seva llar.",
	alternates: { canonical: "/" },
};

const services = [
	{
		title: "Mobles a Mesura",
		description:
			"Mobles personalitzats dissenyats i fabricats segons les seves especificacions",
		image: "/Medida-2.webp",
		href: "/services",
	},
	{
		title: "Instal·lació de Cuines",
		description:
			"Instal·lació professional de gabinets de cuina i personalització",
		image: "/Cuina-2.webp",
		href: "/services",
	},
	{
		title: "Lacatge i Vernissat",
		description:
			"Acabats professionals per a protegir i embellir els seus mobles de fusta",
		image: "/Laca-1.webp",
		href: "/services",
	},
	{
		title: "Mesuraments i Planificació",
		description:
			"Planificació detallada i mesuraments precisos per al seu projecte",
		image: "/Planificacio-1.webp",
		href: "/services",
	},
];

export default function Home() {
	return (
		<div>
			{/* Hero */}
			<section className="relative min-h-[100dvh] flex items-end overflow-hidden">
				<video
					autoPlay
					muted
					loop
					playsInline
					preload="auto"
					poster="/thumbnail.webp"
					aria-hidden
					className="absolute inset-0 h-full w-full object-cover"
				>
					<source src="/video.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/15" />
				<div className="container-site relative pb-20 pt-[120px]">
					<div className="grid lg:grid-cols-12">
						<div className="lg:col-span-8 xl:col-span-7">
							<h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-white max-w-[18ch] rise rise-1">
								Serveis experts de fusteria a Andorra
							</h1>
							<p className="mt-6 text-lg md:text-xl text-white/85 max-w-[46ch] rise rise-2">
								Creant solucions de fusta elegants i funcionals per a la seva
								llar i negoci
							</p>
							<div className="mt-10 flex flex-wrap gap-4 rise rise-3">
								<Link href="/portfolio" className="btn btn-primary">
									Veure tots els Projectes
								</Link>
								<Link href="/contact" className="btn btn-inverse">
									Contacta&apos;ns
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Projecte Destacat */}
			<section className="py-24 md:py-32">
				<div className="container-site">
					<Reveal>
						<div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
							<div className="lg:col-span-7">
								<div className="relative aspect-[4/3]">
									<Image
										src={featuredProject.image.url}
										alt={featuredProject.image.alt}
										fill
										sizes="(min-width:1024px) 58vw, 100vw"
										className="object-cover"
									/>
								</div>
								<FeaturedGallery images={featuredProject.gallery} />
							</div>
							<div className="lg:col-span-5">
								<p className="eyebrow">Projecte destacat</p>
								<h2 className="mt-3 text-3xl md:text-4xl tracking-tight">
									{featuredProject.title}
								</h2>
								<p className="mt-5 text-ink-muted leading-relaxed">
									{featuredProject.description}
								</p>
								<ul className="mt-8 hairline-t">
									{featuredProject.features.map((feature: string) => (
										<li
											key={feature}
											className="flex gap-3 py-3 border-b border-hairline text-sm"
										>
											<span
												className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-brand"
												aria-hidden
											/>
											{feature}
										</li>
									))}
								</ul>
								<Link href="/portfolio" className="btn btn-secondary mt-8">
									Veure tots els Projectes
								</Link>
							</div>
						</div>
					</Reveal>
				</div>
			</section>

			{/* Els nostres Serveis */}
			<section className="py-24 md:py-32 hairline-t">
				<div className="container-site">
					<h2 className="text-3xl md:text-4xl tracking-tight">
						Els nostres Serveis
					</h2>
					<ServicesList services={services} />
				</div>
			</section>

			{/* Call to Action */}
			<section className="bg-brand text-on-brand py-20 md:py-28">
				<div className="container-site grid lg:grid-cols-12 gap-8 items-end">
					<div className="lg:col-span-8">
						<h2 className="text-4xl md:text-5xl tracking-tight leading-[1.05]">
							Llest per Començar el teu Projecte?
						</h2>
						<p className="mt-5 text-lg max-w-[50ch] opacity-90">
							Fem realitat la teva visió. Contacta&apos;ns avui per a una
							consulta i pressupost gratuït.
						</p>
					</div>
					<div className="lg:col-span-4 lg:justify-self-end">
						<Link href="/contact" className="btn btn-on-brand">
							Contacta&apos;ns
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
