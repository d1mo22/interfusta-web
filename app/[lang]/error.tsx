"use client";

import { useEffect } from "react";
import { Grain } from "@/components/grain";
import { ServerError } from "@/components/server-error";
import { useErrorStrings } from "@/components/error-strings";
import { localeHref } from "@/lib/i18n-config";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const { lang, ...labels } = useErrorStrings();
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="bg-paper text-ink">
			<Grain />
			<section className="pt-[104px] pb-[120px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<ServerError reset={reset} labels={labels} homeHref={localeHref(lang, "/")} />
				</div>
			</section>
		</div>
	);
}
