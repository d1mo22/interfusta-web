import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";
import { findService, services, type Service } from "@/data/services";
import { getDictionary, getLocale } from "@/lib/i18n";
import { localeHref, pageMetadata } from "@/lib/i18n-config";

// Runs once per locale that app/[lang]/layout.tsx generates, so every
// lang × slug pair (5 × 8) is prerendered.
export function generateStaticParams() {
	return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const [{ slug }, lang, dict] = await Promise.all([params, getLocale(), getDictionary()]);
	const service = findService(slug);
	if (!service) return {};
	const item = dict.services.items[service.slug];
	return pageMetadata(lang, `/services/${service.slug}`, item.title, item.description);
}

export default async function ServiceDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const [{ slug }, lang, dict] = await Promise.all([params, getLocale(), getDictionary()]);
	const service = findService(slug);
	if (!service) notFound();

	const t = dict.services;
	const item = t.items[service.slug];
	const relatedServices = service.related
		.map((relatedSlug) => findService(relatedSlug))
		.filter((s): s is Service => Boolean(s));

	return (
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading title={<>{item.title}</>} intro={item.description} />
				</div>
			</section>

			<section className="relative h-[560px] overflow-hidden">
				<Image
					src={service.imageUrl}
					alt={item.title}
					fill
					priority
					className="object-cover"
					sizes="100vw"
				/>
			</section>

			<section className="pt-28 pb-24">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid lg:grid-cols-[7fr_5fr] gap-16 items-start">
					<div className="flex flex-col gap-10">
						{item.extra.length > 0 && (
							<div className="flex flex-col gap-5">
								{item.extra.map((paragraph) => (
									<p key={paragraph.slice(0, 24)} className="text-ink-muted text-lg max-w-[65ch]">
										{paragraph}
									</p>
								))}
							</div>
						)}

						<div className="flex flex-col gap-6">
							<h2 className="h-display text-[30px]">{t.howWeWork}</h2>
							<span className="rule" />
							<div className="flex flex-col border-b border-hairline">
								{item.process.map((step, index) => (
									<div
										key={step.title}
										className="grid lg:grid-cols-[80px_1fr] gap-4 py-8 border-t border-hairline items-start"
									>
										<span className="font-mono text-[13px] tracking-[.02em] font-medium text-brand-ink">
											{String(index + 1).padStart(2, "0")}
										</span>
										<div className="flex flex-col gap-2">
											<h3 className="h-display text-[22px]">{step.title}</h3>
											<p className="text-ink-muted max-w-[55ch]">{step.text}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="bg-stone p-10 flex flex-col gap-5">
						<h2 className="h-display text-[26px]">{t.ctaTitle}</h2>
						<p className="text-ink-muted">{t.ctaText}</p>
						<Link
							href={localeHref(lang, "/contact")}
							className="btn-press inline-flex h-[54px] items-center justify-center px-[30px] bg-brand text-on-dark text-[17px] font-bold rounded-none hover:bg-brand-deep hover:text-on-dark self-start"
						>
							{t.ctaButton}
						</Link>
					</div>
				</div>
			</section>

			{relatedServices.length > 0 && (
				<section className="bg-stone py-24">
					<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col gap-10">
						<h2 className="h-display text-[30px]">{t.related}</h2>
						<div className="grid md:grid-cols-3 gap-12">
							{relatedServices.map((related) => {
								const relatedItem = t.items[related.slug];
								return (
									<Link
										key={related.slug}
										href={localeHref(lang, `/services/${related.slug}`)}
										className="group flex flex-col gap-4"
									>
										<div className="relative aspect-[4/3] w-full overflow-hidden">
											<Image
												src={related.imageUrl}
												alt={relatedItem.title}
												fill
												className="object-cover transition-transform duration-200 group-hover:scale-105"
												sizes="(min-width: 768px) 33vw, 100vw"
											/>
										</div>
										<h3 className="h-display text-[22px] group-hover:text-brand-ink transition-colors duration-150">
											{relatedItem.title}
										</h3>
										<p className="text-ink-muted text-[15px]">{relatedItem.description}</p>
									</Link>
								);
							})}
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
