import { Skeleton } from "@/components/ui/skeleton";

export function ProjectDetailsSkeleton() {
	return (
		<div className="bg-paper text-ink pt-[104px] pb-[136px]">
			<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col gap-12">
				<Skeleton className="h-6 w-40 rounded-none bg-stone" />

				<Skeleton className="h-12 w-3/4 rounded-none bg-stone" />

				<div className="grid grid-cols-3 gap-8 border-y border-hairline py-5">
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-20 rounded-none bg-stone" />
						<Skeleton className="h-4 w-28 rounded-none bg-stone" />
					</div>
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-32 rounded-none bg-stone" />
						<Skeleton className="h-4 w-24 rounded-none bg-stone" />
					</div>
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-20 rounded-none bg-stone" />
						<Skeleton className="h-4 w-16 rounded-none bg-stone" />
					</div>
				</div>

				<Skeleton className="aspect-[3/2] w-full rounded-none bg-stone" />

				<div className="flex flex-col gap-3 max-w-[65ch]">
					<Skeleton className="h-4 w-full rounded-none bg-stone" />
					<Skeleton className="h-4 w-full rounded-none bg-stone" />
					<Skeleton className="h-4 w-3/4 rounded-none bg-stone" />
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					{[...Array(6)].map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Skeleton
							key={index}
							className="aspect-[4/5] w-full rounded-none bg-stone"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
