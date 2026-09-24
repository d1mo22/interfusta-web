import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Accent } from "@/components/accent";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/data/services";
import { getDictionary, getLocale } from "@/lib/i18n";
import { localeHref, pageMetadata } from "@/lib/i18n-config";

export async function generateMetadata(): Promise<Metadata> {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	return pageMetadata(lang, "/services", dict.services.metaTitle, dict.services.metaDescription);
}

export default async function ServicesPage() {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	const t = dict.services;

	return (
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading
						title={<Accent text={t.title} />}
						intro={t.intro}
					/>
				</div>
			</section>

			<section className="relative h-[560px] overflow-hidden">
				<Image
					src="/Cuina-2.webp"
					alt={t.heroAlt}
					fill
					priority
					className="object-cover"
					sizes="100vw"
				/>
			</section>

			<section className="pt-28 pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col">
					{services.map((service) => {
						const item = t.items[service.slug];
						return (
							<article
								key={service.slug}
								className="grid lg:grid-cols-[5fr_4fr_3fr] gap-8 lg:gap-16 items-start border-t border-hairline first:border-t-0 pt-10 pb-12 first:pt-0"
							>
								<Link
									href={localeHref(lang, `/services/${service.slug}`)}
									className="group"
								>
									<h2 className="h-display text-[44px] max-w-[14ch] group-hover:text-brand-ink transition-colors duration-150">
										{item.title}
									</h2>
								</Link>
								<p className="text-ink-muted pt-2.5">{item.description}</p>
								<Link
									href={localeHref(lang, `/services/${service.slug}`)}
									className="relative aspect-4/3 w-full block"
								>
									<Image
										src={service.imageUrl}
										alt={item.title}
										fill
										className="object-cover"
										sizes="(min-width: 1024px) 25vw, 100vw"
									/>
								</Link>
							</article>
						);
					})}
				</div>
			</section>
		</div>
	);
}
