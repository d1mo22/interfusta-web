import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardSkeleton() {
	return (
		<div className="min-h-screen pt-16 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header Skeleton */}
				<div className="flex justify-between items-center mb-8">
					<Skeleton className="h-10 w-48" />
					<Skeleton className="h-10 w-40" />
				</div>

				{/* Projects List Skeleton */}
				<div className="grid gap-6">
					{[...Array(4)].map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={index} className="bg-white rounded-lg p-6 shadow-sm">
							<div className="flex items-start gap-6">
								{/* Thumbnail Skeleton */}
								<Skeleton className="h-32 w-48 rounded-lg flex-shrink-0" />

								{/* Content Skeleton */}
								<div className="flex-grow space-y-4">
									<Skeleton className="h-7 w-3/4" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-1/4" />
								</div>

								{/* Actions Skeleton */}
								<div className="flex gap-2">
									<Skeleton className="h-9 w-24" />
									<Skeleton className="h-9 w-24" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
