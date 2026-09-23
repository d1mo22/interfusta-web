"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Grain } from "@/components/grain";
import { ErrorSheet } from "@/components/error-sheet";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="bg-paper text-ink">
			<Grain />
			<section className="pt-[104px] pb-[120px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<ErrorSheet
						code="500"
						titleBlock={{
							title: "Peça esquerdada",
							rows: [
								["Full", "500 / —"],
								["Escala", "1:1"],
								["Estat", "En reparació", true],
							],
						}}
						dimensions={{
							topLabel: "Esquerda · 500",
							heightLabel: "420",
							widthLabel: "1 500",
						}}
						ringSeeds={[3, 11]}
						crackedRingIndex={1}
						dimsDelayS={1.8}
					/>
					<div className="grid gap-12 mt-11 items-end lg:grid-cols-[8fr_4fr]">
						<div className="flex flex-col gap-5">
							<h1 className="h-page">Alguna cosa s&apos;ha esquerdat</h1>
							<span className="rule" />
						</div>
						<div className="flex flex-col gap-5">
							<p className="text-ink-muted text-[17px] max-w-[44ch] leading-relaxed">
								Hi ha hagut un error al nostre costat. Torna-ho a provar
								d&apos;aquí a uns moments.
							</p>
							<div className="flex flex-wrap items-center gap-7 pt-2">
								<button
									type="button"
									onClick={() => reset()}
									className="btn-press inline-flex h-[54px] items-center px-[30px] bg-brand text-on-dark-ink font-semibold rounded-none hover:bg-on-dark-ink hover:text-on-dark"
								>
									Torna-ho a provar
								</button>
								<Link
									href="/"
									className="underline decoration-brand decoration-2 underline-offset-[6px] font-medium hover:text-brand-ink"
								>
									Torna a l&apos;inici
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
