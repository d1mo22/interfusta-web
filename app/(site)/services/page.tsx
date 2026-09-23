import Image from "next/image";
import Link from "next/link";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/data/services";

export const metadata = {
	title: "Serveis",
	description:
		"Mobles a mida, cuines, lacatge, Corian i estructures de fusta. Descobreix tots els serveis de fusteria de Fusteria InterFusta a Andorra.",
	alternates: {
		canonical: "/services",
	},
	openGraph: {
		title: "Serveis",
		description:
			"Mobles a mida, cuines, lacatge, Corian i estructures de fusta. Descobreix tots els serveis de fusteria de Fusteria InterFusta a Andorra.",
		images: [
			{
				url: "/thumbnail.webp",
				width: 1280,
				height: 720,
			},
		],
	},
};

export default function ServicesPage() {
	return (
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading
						title={
							<>
								Els nostres <span className="text-brand">serveis</span>
							</>
						}
						intro="Oferim una àmplia gamma de serveis de fusteria, combinant artesania tradicional amb tècniques modernes per a resultats excepcionals."
					/>
				</div>
			</section>

			<section className="relative h-[560px] overflow-hidden">
				<Image
					src="/Cuina-2.webp"
					alt="Cuina a mida amb illa de fusta"
					fill
					priority
					className="object-cover"
					sizes="100vw"
				/>
			</section>

			<section className="pt-28 pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col">
					{services.map((service) => (
						<article
							key={service.title}
							className="grid lg:grid-cols-[5fr_4fr_3fr] gap-8 lg:gap-16 items-start border-t border-hairline first:border-t-0 pt-10 pb-12 first:pt-0"
						>
							<Link href={`/services/${service.slug}`} className="group">
								<h2 className="h-display text-[44px] max-w-[14ch] group-hover:text-brand-ink transition-colors duration-150">
									{service.title}
								</h2>
							</Link>
							<p className="text-ink-muted pt-2.5">{service.description}</p>
							<Link
								href={`/services/${service.slug}`}
								className="relative aspect-[4/3] w-full block"
							>
								<Image
									src={service.imageUrl}
									alt={service.title}
									fill
									className="object-cover"
									sizes="(min-width: 1024px) 25vw, 100vw"
								/>
							</Link>
						</article>
					))}
				</div>
			</section>
		</div>
	);
}
