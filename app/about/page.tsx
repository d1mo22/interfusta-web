/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, Users, Heart } from "lucide-react";

export default function AboutPage() {
	const stats = [
		{ label: "Anys d'experiència", value: "10+", icon: Clock },
		{ label: "Projectes realitzats", value: "250+", icon: Award },
		{ label: "Clients satisfets", value: "100+", icon: Heart },
		{ label: "Membres de l'equipo", value: "6", icon: Users },
	];

	return (
		<div className="min-h-screen pt-16">
			<div className="bg-amber-50 py-12 md:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h1 className="text-4xl font-bold mb-6">Sobre InterFusta</h1>
							<p className="text-lg text-gray-600 mb-6">
								Des de la nostra creació, Interfusta ha estat a
								l&apos;avantguarda dels serveis de fusteria de primera qualitat
								a Andorra. El nostre compromís amb l&apos;excel·lència i
								l&apos;atenció al detall ens ha convertit en un nom de confiança
								en la indústria.
							</p>
							<p className="text-lg text-gray-600">
								Combinem tècniques tradicionals d&apos;ebenisteria amb
								tecnologia moderna per a crear peces sorprenents que superen la
								prova del temps. El nostre equip d&apos;experts artesans aporta
								dècades d&apos;experiència combinada a cada projecte.
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
							Els nostres Valors
						</h2>
						<div className="grid md:grid-cols-3 gap-8 ">
							{[
								{
									title: "Artesania de Qualitat",
									description:
										"Ens enorgullim d'oferir una qualitat excepcional en cada projecte, utilitzant els millors materials i tècniques",
								},
								{
									title: "Satisfacció del Client",
									description:
										"La teva satisfacció és la nostra prioritat. Treballem estretament amb tu per a assegurar que la teva visió es faci realitat.",
								},
								{
									title: "Sostenibilitat",
									description:
										"Estem compromesos amb pràctiques sostenibles, utilitzant materials d'origen responsable i minimitzant els residus.",
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
