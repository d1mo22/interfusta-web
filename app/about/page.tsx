import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, Users, Heart } from "lucide-react";

export default function AboutPage() {
	const stats = [
		{ label: "Años de experiencia", value: "10+", icon: Clock },
		{ label: "Proyectos realizados", value: "250+", icon: Award },
		{ label: "Clientes satisfechos", value: "100+", icon: Heart },
		{ label: "Miembros del equipo", value: "6", icon: Users },
	];

	return (
		<div className="min-h-screen pt-16">
			<div className="bg-amber-50 py-12 md:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h1 className="text-4xl font-bold mb-6">Sobre Interfusta</h1>
							<p className="text-lg text-gray-600 mb-6">
								Desde nuestra creación, Interfusta ha estado a la vanguardia de
								los servicios de carpintería de primera calidad en Andorra.
								Nuestro compromiso con la excelencia y la atención al detalle
								nos ha convertido en un nombre de confianza en la industria.
							</p>
							<p className="text-lg text-gray-600">
								Combinamos técnicas tradicionales de ebanistería con tecnología
								moderna para crear piezas asombrosas que superan la prueba del
								tiempo. Nuestro equipo de expertos artesanos aporta décadas de
								experiencia combinada a cada proyecto.
							</p>
						</div>
						<div className="relative">
							<img
								src="https://placehold.co/800x600"
								alt="Our workshop"
								className="rounded-lg shadow-xl"
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="py-12 md:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-4 gap-8">
						{stats.map((stat) => (
							<Card key={stat.label}>
								<CardContent className="p-6 text-center">
									<stat.icon className="w-8 h-8 mx-auto mb-4 text-amber-800" />
									<div className="text-3xl font-bold mb-2">{stat.value}</div>
									<div className="text-gray-600">{stat.label}</div>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="mt-24">
						<h2 className="text-3xl font-bold text-center mb-12">
							Nuestros Valores
						</h2>
						<div className="grid md:grid-cols-3 gap-8">
							{[
								{
									title: "Artesanía de Calidad",
									description:
										"Nos enorgullecemos de ofrecer una calidad excepcional en cada proyecto, utilizando los mejores materiales y técnicas.",
								},
								{
									title: "Satisfacción del Cliente",
									description:
										"Tu satisfacción es nuestra prioridad. Trabajamos estrechamente contigo para asegurar que tu visión se haga realidad.",
								},
								{
									title: "Sostenibilidad",
									description:
										"Estamos comprometidos con prácticas sostenibles, utilizando materiales de origen responsable y minimizando los residuos.",
								},
							].map((value) => (
								<Card key={value.title}>
									<CardContent className="p-6">
										<h3 className="text-xl font-bold mb-4">{value.title}</h3>
										<p className="text-gray-600">{value.description}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
