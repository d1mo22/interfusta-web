import type { Metadata } from "next";
import Image from "next/image";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";
import { Accent } from "@/components/accent";
import { getDictionary, getLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n-config";

export async function generateMetadata(): Promise<Metadata> {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	return pageMetadata(lang, "/about", dict.about.metaTitle, dict.about.metaDescription);
}

// Same order as about.stats in messages/*.json.
const STAT_VALUES = ["10+", "250+", "100+", "6"];

export default async function AboutPage() {
	const dict = (await getDictionary()).about;
	const stats = dict.stats.map((label, i) => ({ label, value: STAT_VALUES[i] }));

	return (
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading title={<Accent text={dict.title} />} />
				</div>
			</section>

			<section className="pb-28">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid lg:grid-cols-[7fr_5fr] gap-16 items-start">
					<div className="flex flex-col gap-6 text-ink-muted text-lg max-w-[60ch]">
						<p className="text-xl text-ink">{dict.lead}</p>
						<p>{dict.body}</p>
					</div>
					<div className="relative aspect-4/3 w-full">
						<Image
							src="/About.webp"
							alt={dict.imageAlt}
							fill
							className="object-cover"
							sizes="(min-width: 1024px) 42vw, 100vw"
						/>
					</div>
				</div>
			</section>

			<section className="bg-stone py-24">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:divide-x divide-hairline">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="px-8 lg:first:pl-0 flex flex-col gap-3"
						>
							<span className="font-display font-semibold text-[72px] leading-none tracking-[-0.03em] text-brand [font-variation-settings:'wdth'_80]">
								{stat.value}
							</span>
							<span className="text-ink-muted text-[15px]">{stat.label}</span>
						</div>
					))}
				</div>
			</section>

			<section className="pt-28 pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col gap-6">
					<h2 className="h-page text-[80px]">
						<Accent text={dict.valuesTitle} />
					</h2>
					<span className="rule" />
					<div className="flex flex-col border-b border-hairline">
						{dict.values.map((value, index) => (
							<div
								key={value.title}
								className="grid lg:grid-cols-[80px_5fr_6fr] gap-4 lg:gap-16 py-10 border-t border-hairline items-start"
							>
								<span className="font-mono text-[13px] tracking-[.02em] font-medium text-brand-ink">
									{String(index + 1).padStart(2, "0")}
								</span>
								<h3 className="h-display text-[30px]">{value.title}</h3>
								<p className="text-ink-muted max-w-[50ch]">
									{value.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
