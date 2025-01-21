import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjects, getCategories } from "../actions/data";

const categories = await getCategories();

const projects = await getProjects();

export default function PortfolioPage() {
	return (
		<div className="min-h-screen pt-16 bg-amber-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-4xl font-bold text-center mb-4">
					Nuestros Proyectos
				</h1>
				<p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
					Explore nuestra colección de proyectos terminados, que muestran
					nuestro compromiso con la calidad artesanal y la atención al detalle.
				</p>

				<Tabs defaultValue="Todos los Proyectos" className="w-full">
					<TabsList className="flex flex-wrap justify-center mb-8 gap-2 w-full min-h-fit">
						{categories.map((category) => (
							<TabsTrigger
								key={category.id}
								value={category.name}
								className="px-4 py-2 text-sm sm:text-base"
							>
								{category.name}
							</TabsTrigger>
						))}
					</TabsList>

					{categories.map((category) => (
						<TabsContent key={category.id} value={category.name}>
							<div className="grid md:grid-cols-2 gap-8">
								{projects
									.filter(
										(project) =>
											category.name === "Todos los Proyectos" ||
											project.category_id === category.id,
									)
									.map((project) => (
										<Card key={project.id} className="overflow-hidden">
											<div className="relative h-64">
												<Link href={`/portfolio/${project.id}`}>
													<img
														src={project.first_image.url}
														alt={project.first_image.alt_text || project.title}
														className="w-full h-full object-cover"
													/>
												</Link>
											</div>
											<CardContent className="p-6">
												<h3 className="text-xl font-bold mb-2">
													{project.title}
												</h3>
												<p className="text-gray-600 mb-4">
													{project.description}
												</p>
												<Link href={`/portfolio/${project.id}`}>
													<Button variant="outline">Ver Detalles</Button>
												</Link>
											</CardContent>
										</Card>
									))}
							</div>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</div>
	);
}
