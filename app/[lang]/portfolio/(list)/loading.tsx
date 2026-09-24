import { ProjectSkeleton } from "@/components/projects-skeleton";

// In the (list) group so this Suspense boundary doesn't wrap portfolio/[id].
// [id] has no loading.tsx either: its notFound() must fail the render before
// anything streams, or the missing-project 404 goes out with status 200.
export default function Loading() {
	return <ProjectSkeleton />;
}
