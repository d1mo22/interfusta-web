import Link from "next/link";
import { ErrorSheet } from "@/components/error-sheet";

export type ServerErrorLabels = {
	sheetTitle: string;
	status: string;
	title: string;
	text: string;
	retry: string;
	home: string;
	sheet: { sheet: string; scale: string; state: string; crack: string };
};

// global-error.tsx replaces the root layout, so it has no dictionary and uses these.
const CATALAN: ServerErrorLabels = {
	sheetTitle: "Peça esquerdada",
	status: "En reparació",
	title: "Alguna cosa s'ha esquerdat",
	text: "Hi ha hagut un error al nostre costat. Torna-ho a provar d'aquí a uns moments.",
	retry: "Torna-ho a provar",
	home: "Torna a l'inici",
	sheet: { sheet: "Full", scale: "Escala", state: "Estat", crack: "Esquerda" },
};

// The 500 page body, shared by app/[lang]/error.tsx and app/global-error.tsx.
export function ServerError({
	reset,
	labels = CATALAN,
	homeHref = "/",
}: {
	reset: () => void;
	labels?: ServerErrorLabels;
	homeHref?: string;
}) {
	return (
		<>
			<ErrorSheet
				code="500"
				titleBlock={{
					title: labels.sheetTitle,
					rows: [
						[labels.sheet.sheet, "500 / —"],
						[labels.sheet.scale, "1:1"],
						[labels.sheet.state, labels.status, true],
					],
				}}
				dimensions={{
					topLabel: `${labels.sheet.crack} · 500`,
					heightLabel: "420",
					widthLabel: "1 500",
				}}
				ringSeeds={[3, 11]}
				crackedRingIndex={1}
				dimsDelayS={1.8}
			/>
			<div className="grid gap-12 mt-11 items-end lg:grid-cols-[8fr_4fr]">
				<div className="flex flex-col gap-5">
					<h1 className="h-page">{labels.title}</h1>
					<span className="rule" />
				</div>
				<div className="flex flex-col gap-5">
					<p className="text-ink-muted text-[17px] max-w-[44ch] leading-relaxed">{labels.text}</p>
					<div className="flex flex-wrap items-center gap-7 pt-2">
						<button
							type="button"
							onClick={() => reset()}
							className="btn-press inline-flex h-[54px] items-center px-[30px] bg-brand text-on-dark text-[19px] font-bold rounded-none hover:bg-brand-deep hover:text-on-dark"
						>
							{labels.retry}
						</button>
						<Link
							href={homeHref}
							className="underline decoration-brand decoration-2 underline-offset-[6px] font-medium hover:text-brand-ink"
						>
							{labels.home}
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
