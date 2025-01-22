import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AdminProjectsSkeleton() {
	return (
		<div className="min-h-screen pt-16 bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 py-12">
				<Skeleton className="h-10 w-32 mb-6" />

				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-48" />
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Grid de título y categoría */}
						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>

						{/* Descripción corta */}
						<div className="space-y-2">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-10 w-full" />
						</div>

						{/* Descripción completa */}
						<div className="space-y-2">
							<Skeleton className="h-5 w-36" />
							<Skeleton className="h-32 w-full" />
						</div>

						{/* Features */}
						<div className="space-y-2">
							<Skeleton className="h-5 w-24" />
							<div className="flex gap-2">
								<Skeleton className="h-10 flex-grow" />
								<Skeleton className="h-10 w-10" />
							</div>
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex items-center gap-2">
									<Skeleton className="h-10 flex-grow" />
									<Skeleton className="h-8 w-8" />
								</div>
							))}
						</div>

						{/* Grid de fecha y duración */}
						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>

						{/* Botones */}
						<div className="flex justify-end gap-4">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-32" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
