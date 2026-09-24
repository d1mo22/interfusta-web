import type { Metadata } from "next";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";
import { Accent } from "@/components/accent";
import { RichText } from "@/components/rich-text";
import { getDictionary, getLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n-config";

export async function generateMetadata(): Promise<Metadata> {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	return pageMetadata(lang, "/privacitat", dict.privacy.metaTitle, dict.privacy.metaDescription);
}

const linkClass = "text-ink underline underline-offset-2 hover:text-brand-ink";

// Nodes for the {slots} in privacy.sections[].paragraphs.
const SLOTS = {
	company: <strong className="text-ink">Fusteria InterFusta SL</strong>,
	email: (
		<a href="mailto:interfusta@interfusta.ad" className={linkClass}>
			interfusta@interfusta.ad
		</a>
	),
	phone: (
		<a href="tel:+376804440" className={linkClass}>
			+376 804 440
		</a>
	),
	resend: (
		<a href="https://resend.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
			Resend
		</a>
	),
	inbox: <span className="font-mono text-[15px]">interfusta@interfusta.ad</span>,
};

export default async function PrivacyPage() {
	const t = (await getDictionary()).privacy;
	return (
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading title={<Accent text={t.title} />} intro={t.intro} />
				</div>
			</section>

			<section className="pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<div className="max-w-[70ch] flex flex-col border-b border-hairline">
						{t.sections.map((section) => (
							<div
								key={section.title}
								className="flex flex-col gap-4 py-10 border-t border-hairline first:border-t-0 first:pt-0"
							>
								<h2 className="h-display text-[24px]">{section.title}</h2>
								<div className="text-ink-muted flex flex-col gap-4 leading-relaxed">
									{section.paragraphs.map((paragraph) => (
										<p key={paragraph}>
											<RichText text={paragraph} slots={SLOTS} />
										</p>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
