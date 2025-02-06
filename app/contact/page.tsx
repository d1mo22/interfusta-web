"use client";

import { useState } from "react";
import { createContact } from "@/app/actions/contact";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(false);

		try {
			const formData = new FormData(e.currentTarget);
			const result = await createContact(formData);

			if (result.error) {
				setError(result.error);
			} else {
				setSuccess(true);
				(e.target as HTMLFormElement).reset();
			}
		} catch (error) {
			console.log(error);
			setError("Error al enviar el missatge");
		} finally {
			setIsSubmitting(false);
		}
	}
	return (
		<div className="min-h-screen pt-16 bg-amber-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-4xl font-bold text-center mb-4">
					Contacta&apos;ns
				</h1>
				<p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
					Posi&apos;s en contacte amb nosaltres per a qualsevol consulta sobre
					els nostres serveis o per a sobre les necessitats del seu projecte.
				</p>

				<div className="grid lg:grid-cols-2 gap-12">
					<Card className="h-fit">
						{" "}
						{/* Añadir h-fit para altura dinámica */}
						<CardContent className="p-6">
							<h2 className="text-2xl font-bold mb-6">
								Envia&apos;ns un missatge
							</h2>
							<form className="space-y-6" onSubmit={handleSubmit}>
								<div className="grid sm:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="firstName"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Nom
										</label>
										<Input id="firstName" name="firstName" required />
									</div>
									<div>
										<label
											htmlFor="lastName"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Cognom
										</label>
										<Input id="lastName" name="lastName" required />
									</div>
								</div>
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Email
									</label>
									<Input
										id="email"
										name="email"
										type="email"
										required
										placeholder="interfusta@andorra.ad"
									/>
								</div>
								<div>
									<label
										htmlFor="phone"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Telèfon
									</label>
									<Input
										id="phone"
										name="phone"
										type="tel"
										required
										placeholder="+376 804 440"
									/>
								</div>
								<div className="flex-grow">
									<label
										htmlFor="message"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Missatge
									</label>
									<Textarea
										id="message"
										name="message"
										rows={6}
										required
										className="min-h-[150px] resize-y"
										placeholder="Expliqui'ns en què podem ajudar-lo. Detalli el seu projecte o consulta..."
									/>
								</div>
								{error && (
									<Alert variant="destructive">
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}
								{success && (
									<Alert>
										<AlertDescription>
											Missatge enviat correctament. Ens posarem en contacte amb
											vostè el més aviat possible.
										</AlertDescription>
									</Alert>
								)}
								<Button
									type="submit"
									className="w-full bg-amber-800 hover:bg-amber-900"
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Loader className="mr-2 h-4 w-4 animate-spin" />
											Enviant...
										</>
									) : (
										"Enviar Missatge"
									)}
								</Button>
							</form>
						</CardContent>
					</Card>

					<div className="space-y-8">
						<Card>
							<CardContent className="p-6">
								<h2 className="text-2xl font-bold mb-6">
									Informació de contacte
								</h2>
								<div className="space-y-4">
									<div className="flex items-start">
										<Mail className="w-6 h-6 text-amber-800 mt-1" />
										<div className="ml-4">
											<h3 className="font-semibold">Email</h3>
											<p className="text-gray-600 hover:underline">
												<a href="mailto:interfusta@andorra.ad">
													interfusta@andorra.ad
												</a>
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<Phone className="w-6 h-6 text-amber-800 mt-1" />
										<div className="ml-4">
											<h3 className="font-semibold">Telèfon</h3>
											<p className="text-gray-600">+376 804 440</p>
										</div>
									</div>
									<div className="flex items-start">
										<MapPin className="w-6 h-6 text-amber-800 mt-1" />
										<div className="ml-4">
											<h3 className="font-semibold">Direcció</h3>
											<p className="text-gray-600">
												Passatge d&apos;Enclar S/N
												<br />
												Santa Coloma, AD500
												<br />
												Andorra
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<Clock className="w-6 h-6 text-amber-800 mt-1" />
										<div className="ml-4">
											<h3 className="font-semibold">Horari laboral</h3>
											<p className="text-gray-600">
												Dilluns - Divendres: 9:00 - 17:00
												<br />
												Dissabte: 10:00 - 13:00
												<br />
												Diumenge: Tancat
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<h2 className="text-2xl font-bold mb-6">Localització</h2>
								<div className="aspect-video bg-gray-100 rounded-lg">
									<iframe
										title="Location map"
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d1.5034337698899677!3d42.49834595869392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a5f58f12d8ead7%3A0x4b992abc827fc509!2sFusteria%20InterFusta%20SL!5e0!3m2!1sen!2sad!4v1705361686744!5m2!1sen!2sad"
										width="100%"
										height="100%"
										style={{ border: 0 }}
										allowFullScreen
										loading="lazy"
										referrerPolicy="no-referrer"
									/>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
