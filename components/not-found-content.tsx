import Link from "next/link";
import { Grain } from "@/components/grain";
import { ErrorSheet } from "@/components/error-sheet";
import { ApplyTheme } from "@/components/apply-theme";
import { localeHref, type Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/i18n";

// Shared between app/[lang]/not-found.tsx (segment 404, localized) and
// app/global-not-found.tsx (truly unmatched routes, Catalan only — it can't
// read the [lang] root param).
export function NotFoundContent({
	lang,
	dict,
}: {
	lang: Locale;
	dict: Pick<Dictionary, "notFound" | "errorSheet">;
}) {
	const t = dict.notFound;
	const s = dict.errorSheet;
	return (
		<div className="bg-paper text-ink">
			<ApplyTheme />
			<Grain />
			<section className="pt-[104px] pb-[120px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<ErrorSheet
						code="404"
						titleBlock={{
							title: t.sheetTitle,
							rows: [
								[s.sheet, "404 / —"],
								[s.scale, "1:1"],
								[s.material, s.oak],
							],
						}}
					/>
					<div className="grid gap-12 mt-11 items-end lg:grid-cols-[8fr_4fr]">
						<div className="flex flex-col gap-5">
							<h1 className="h-page">{t.title}</h1>
							<span className="rule" />
						</div>
						<div className="flex flex-col gap-5">
							<p className="text-ink-muted text-[17px] max-w-[44ch] leading-relaxed">{t.text}</p>
							<div className="flex flex-wrap items-center gap-7 pt-2">
								<Link
									href={localeHref(lang, "/")}
									className="btn-press inline-flex h-[54px] items-center px-[30px] bg-brand text-on-dark text-[19px] font-bold rounded-none hover:bg-brand-deep hover:text-on-dark"
								>
									{t.home}
								</Link>
								<Link
									href={localeHref(lang, "/portfolio")}
									className="underline decoration-brand decoration-2 underline-offset-[6px] font-medium hover:text-brand-ink"
								>
									{t.projects}
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
