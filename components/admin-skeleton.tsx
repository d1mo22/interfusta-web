const block = "animate-pulse bg-stone";

export function AdminDashboardSkeleton() {
	return (
		<div
			className="max-w-[1280px] mx-auto px-6 lg:px-20 pt-12 pb-[120px]"
			aria-busy
			aria-label="Carregant projectes"
		>
			<div className="flex flex-wrap items-end justify-between gap-6 pb-10">
				<div className={`${block} h-14 w-64`} />
				<div className={`${block} h-[54px] w-full sm:w-48`} />
			</div>
			<div className={`${block} h-12 max-w-md mb-6`} />
			<ul className="border-b border-hairline">
				{[0, 1, 2, 3].map((i) => (
					<li
						key={i}
						className="grid grid-cols-[104px_1fr] sm:grid-cols-[168px_1fr_auto] gap-5 py-5 border-t border-hairline items-center"
					>
						<div className={`${block} aspect-[4/3]`} />
						<div className="flex flex-col gap-2">
							<div className={`${block} h-3 w-32`} />
							<div className={`${block} h-6 w-3/4`} />
						</div>
						<div className={`${block} h-10 w-40 hidden sm:block`} />
					</li>
				))}
			</ul>
		</div>
	);
}
