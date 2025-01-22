import { Skeleton } from "@/components/ui/skeleton";

export function ProjectDetailsSkeleton() {
	return (
		<div className="min-h-screen pt-16 bg-amber-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<Skeleton className="h-10 w-40 mb-6" />

				<Skeleton className="h-12 w-3/4 mb-6" />

				<div className="grid md:grid-cols-2 gap-8 mb-12">
					<Skeleton className="h-[400px] md:h-[600px] w-full" />
					<div className="space-y-4">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Skeleton className="h-4 w-1/2 mb-2" />
								<Skeleton className="h-4 w-3/4" />
							</div>
							<div>
								<Skeleton className="h-4 w-1/2 mb-2" />
								<Skeleton className="h-4 w-3/4" />
							</div>
							<div>
								<Skeleton className="h-4 w-1/2 mb-2" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>
					</div>
				</div>

				<div className="mb-12">
					<Skeleton className="h-8 w-48 mb-4" />
					<div className="grid md:grid-cols-2 gap-4">
						{[...Array(6)].map((_, index) => (
							<div key={index} className="flex items-center">
								<Skeleton className="h-4 w-4 mr-2" />
								<Skeleton className="h-4 w-full" />
							</div>
						))}
					</div>
				</div>

				<div className="mb-12">
					<Skeleton className="h-8 w-48 mb-4" />
					<div className="grid md:grid-cols-3 gap-4">
						{[...Array(6)].map((_, index) => (
							<Skeleton key={index} className="h-48 w-full" />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
