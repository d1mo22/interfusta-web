import Link from "next/link";
import { Accent } from "@/components/accent";
import { getDictionary, getLocale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n-config";

const MAPS_URL =
	"https://www.google.com/maps?q=Fusteria+InterFusta+SL&ftid=0x12a5f58f12d8ead7:0x4b992abc827fc509";

export async function Footer() {
	const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
	const t = dict.footer;
	return (
		<footer className="bg-stone pt-[72px] pb-10">
			<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
				<div className="grid grid-cols-1 md:grid-cols-[5fr_4fr_3fr] gap-12">
					<div className="flex flex-col gap-5">
						<h3 className="h-display text-[30px]">
							<Accent text={t.title} />
						</h3>
						<p className="text-ink-muted text-[15px] max-w-[36ch]">{t.tagline}</p>
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-mono text-ink-muted text-sm">{t.contact}</span>
						<p className="font-mono text-sm leading-[1.9]">
							<a
								href="mailto:interfusta@interfusta.ad"
								className="hover:text-ink transition-colors duration-150"
							>
								interfusta@interfusta.ad
							</a>
							<br />
							<a
								href="tel:+376804440"
								className="hover:text-ink transition-colors duration-150"
							>
								+376 804 440
							</a>
						</p>
						<a
							href={MAPS_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="font-mono text-sm hover:text-ink transition-colors duration-150"
						>
							Passatge d&apos;Enclar S/N
							<br />
							Santa Coloma, AD500, Andorra
						</a>
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-mono text-ink-muted text-sm">{t.hours}</span>
						<p className="font-mono text-sm leading-[1.9]">
							{t.schedule.map((line) => (
								<span key={line} className="block">
									{line}
								</span>
							))}
						</p>
					</div>
				</div>
				<div className="border-t border-hairline mt-16 pt-5 font-mono text-sm text-ink-muted flex flex-wrap items-center justify-between gap-4">
					<span>
						&copy; {new Date().getFullYear()} Fusteria InterFusta. {t.rights}
					</span>
					<div className="flex items-center gap-4">
						<Link
							href={localeHref(lang, "/privacitat")}
							className="hover:text-ink transition-colors duration-150"
						>
							{t.privacy}
						</Link>
						<span>Santa Coloma, Andorra</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
