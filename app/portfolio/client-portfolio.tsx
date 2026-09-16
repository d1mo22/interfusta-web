/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import type { ClientPortfolioProps, Project, Category } from "@/types/types";
import { ProjectImage } from "@/components/project-images";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";

const ITEMS_PER_PAGE = 8;
const ALL_CATEGORY_NAME = "Todos los Proyectos";

export default function PortfolioPage({
	initialProjects,
	categories,
}: ClientPortfolioProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [activeCategory, setActiveCategory] = useState<Category | undefined>(
		() =>
			categories.find((category) => category.name === ALL_CATEGORY_NAME) ??
			categories[0],
	);
	const projectsRef = useRef<HTMLDivElement>(null);

	const paginateProjects = (projects: Project[], page: number) => {
		const startIndex = (page - 1) * ITEMS_PER_PAGE;
		return projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	};

	const shouldShowPagination = (projects: Project[]) => {
		return projects.length > ITEMS_PER_PAGE;
	};

	const scrollToTop = () => {
		projectsRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
		setTimeout(() => {
			scrollToTop();
		}, 0);
	};

	const categoryName = (categoryId: number) =>
		categories.find((category) => category.id === categoryId)?.name ?? "";

	const projectYear = (project: Project) => {
		const year = new Date(project.completion_date).getFullYear();
		return Number.isNaN(year) ? null : year;
	};

	const filteredProjects = activeCategory
		? initialProjects.filter(
				(project) =>
					activeCategory.name === ALL_CATEGORY_NAME ||
					project.category_id === activeCategory.id,
			)
		: initialProjects;

	const paginatedProjects = paginateProjects(filteredProjects, currentPage);
	const [leadProject, ...restProjects] = paginatedProjects;

	return (
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading
						title={
							<>
								Els nostres <span className="text-brand">projectes</span>
							</>
						}
						intro="Explori la nostra col·lecció de projectes acabats, que mostren el nostre compromís amb la qualitat artesanal i l'atenció al detall."
					/>
				</div>
			</section>

			<section ref={projectsRef} className="pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col gap-[72px]">
					<div className="flex flex-wrap gap-8 py-[18px] border-y border-hairline">
						{categories.map((category) => {
							const isActive = activeCategory?.id === category.id;
							return (
								<button
									key={category.id}
									type="button"
									onClick={() => setActiveCategory(category)}
									className={
										isActive
											? "text-[15px] text-ink underline decoration-brand decoration-2 underline-offset-[7px] transition-colors duration-150"
											: "text-[15px] text-ink-muted hover:text-ink transition-colors duration-150"
									}
								>
									{category.name === ALL_CATEGORY_NAME ? "Tots" : category.name}
								</button>
							);
						})}
					</div>

					{paginatedProjects.length === 0 ? (
						<p className="text-ink-muted">
							No hi ha projectes en aquesta categoria.
						</p>
					) : (
						<>
							<article className="grid lg:grid-cols-[8fr_4fr] gap-16 items-end">
								<div className="relative aspect-[3/2] overflow-hidden">
									<Link href={`/portfolio/${leadProject.id}`}>
										<ProjectImage
											fileName={leadProject.first_image.url}
											altText={leadProject.title}
										/>
									</Link>
								</div>
								<div className="flex flex-col gap-5">
									{projectYear(leadProject) !== null && (
										<span className="font-mono text-[13px] text-ink-muted">
											{projectYear(leadProject)}
										</span>
									)}
									<h2 className="h-display text-[44px]">
										{leadProject.title}
									</h2>
									<span className="rule" />
									<span className="text-[15px] text-ink-muted">
										{categoryName(leadProject.category_id)}
									</span>
									<Link
										href={`/portfolio/${leadProject.id}`}
										prefetch
										className="self-start underline decoration-brand decoration-2 underline-offset-[6px] font-medium hover:text-brand-ink"
									>
										Veure detalls
									</Link>
								</div>
							</article>

							{restProjects.length > 0 && (
								<div className="grid md:grid-cols-3 gap-12">
									{restProjects.map((project) => (
										<article key={project.id} className="flex flex-col gap-4">
											<div className="relative aspect-[4/5] overflow-hidden">
												<Link href={`/portfolio/${project.id}`}>
													<ProjectImage
														fileName={project.first_image.url}
														altText={project.title}
													/>
												</Link>
											</div>
											<div className="flex justify-between items-baseline gap-4">
												<h2 className="h-display text-[26px]">
													{project.title}
												</h2>
												{projectYear(project) !== null && (
													<span className="font-mono text-[13px] text-ink-muted">
														{projectYear(project)}
													</span>
												)}
											</div>
											<div className="flex justify-between items-center">
												<span className="text-[15px] text-ink-muted">
													{categoryName(project.category_id)}
												</span>
												<Link
													href={`/portfolio/${project.id}`}
													prefetch
													className="text-[15px] underline decoration-brand decoration-2 underline-offset-[6px] font-medium hover:text-brand-ink"
												>
													Veure detalls
												</Link>
											</div>
										</article>
									))}
								</div>
							)}
						</>
					)}

					{shouldShowPagination(filteredProjects) && (
						<div className="border-t border-hairline pt-6 flex justify-center gap-7">
							<button
								type="button"
								onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
								disabled={currentPage === 1}
								className="font-mono text-[13px] text-ink-muted hover:text-ink transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none"
							>
								Anterior
							</button>
							<span className="font-mono text-[13px] text-brand font-medium">
								{currentPage}
							</span>
							<button
								type="button"
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={filteredProjects.length <= currentPage * ITEMS_PER_PAGE}
								className="font-mono text-[13px] text-ink-muted hover:text-ink transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none"
							>
								Següent
							</button>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
