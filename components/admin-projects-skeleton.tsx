const block = "animate-pulse bg-stone";

export function AdminProjectsSkeleton() {
	return (
		<div
			className="max-w-[1280px] mx-auto px-6 lg:px-20 pt-8 pb-16"
			aria-busy
			aria-label="Carregant"
		>
			<div className={`${block} h-5 w-28`} />
			<div className="mt-9 grid grid-cols-5 gap-1.5">
				{[0, 1, 2, 3, 4].map((i) => (
					<div key={i} className={`${block} h-1`} />
				))}
			</div>
			<div className={`${block} h-12 w-2/3 max-w-lg mt-14`} />
			<div className={`${block} h-4 w-80 max-w-full mt-4`} />
			<div className={`${block} h-64 mt-10`} />
		</div>
	);
}
