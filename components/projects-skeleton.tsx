import { Skeleton } from "@/components/ui/skeleton";

export function ProjectSkeleton() {
	return (
		<div className="space-y-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Page Title Skeleton */}
				<Skeleton className="h-12 w-64 mx-auto mb-4" />
				<Skeleton className="h-6 w-3/4 mx-auto mb-12" />

				{/* Category Tabs Skeleton */}
				<div className="flex justify-center mb-8">
					{[...Array(4)].map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Skeleton key={index} className="h-10 w-24 mx-2" />
					))}
				</div>

				{/* Project Cards Skeleton */}
				<div className="grid md:grid-cols-2 gap-8">
					{[...Array(6)].map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={index} className="space-y-4">
							<Skeleton className="h-64 w-full" />
							<Skeleton className="h-6 w-3/4" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-10 w-32" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
