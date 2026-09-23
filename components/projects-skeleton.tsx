import { Skeleton } from "@/components/ui/skeleton";

export function ProjectSkeleton() {
	return (
		<div className="bg-paper text-ink pt-[104px] pb-[136px]">
			<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col gap-[72px]">
				{/* Heading Skeleton */}
				<div className="flex flex-col gap-4">
					<Skeleton className="h-12 w-64 rounded-none bg-stone" />
					<Skeleton className="h-6 w-3/4 rounded-none bg-stone" />
				</div>

				{/* Filter Row Skeleton */}
				<div className="flex flex-wrap gap-8 py-[18px] border-y border-hairline">
					{[...Array(4)].map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Skeleton key={index} className="h-4 w-20 rounded-none bg-stone" />
					))}
				</div>

				{/* Lead Project Skeleton */}
				<div className="grid lg:grid-cols-[8fr_4fr] gap-16 items-end">
					<Skeleton className="aspect-3/2 w-full rounded-none bg-stone" />
					<div className="flex flex-col gap-5">
						<Skeleton className="h-4 w-16 rounded-none bg-stone" />
						<Skeleton className="h-10 w-3/4 rounded-none bg-stone" />
						<Skeleton className="h-4 w-32 rounded-none bg-stone" />
					</div>
				</div>

				{/* Project Cards Skeleton */}
				<div className="grid md:grid-cols-3 gap-12">
					{[...Array(6)].map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={index} className="flex flex-col gap-4">
							<Skeleton className="aspect-4/5 w-full rounded-none bg-stone" />
							<Skeleton className="h-6 w-3/4 rounded-none bg-stone" />
							<Skeleton className="h-4 w-1/2 rounded-none bg-stone" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
