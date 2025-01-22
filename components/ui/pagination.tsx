import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
}

export function Pagination({
	currentPage,
	totalItems,
	itemsPerPage,
	onPageChange,
}: PaginationProps) {
	return (
		<div className="flex justify-center gap-2 mt-8">
			<Button
				variant="outline"
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			<span className="flex items-center px-4">Página {currentPage}</span>
			<Button
				variant="outline"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={totalItems <= currentPage * itemsPerPage}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
