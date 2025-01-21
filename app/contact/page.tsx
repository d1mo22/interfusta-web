import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
	return (
		<div className="min-h-screen pt-16 bg-amber-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-4xl font-bold text-center mb-4">Contáctanos</h1>
				<p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
					Póngase en contacto con nosotros para cualquier consulta sobre
					nuestros servicios o para sobre las necesidades de su proyecto.
				</p>

				<div className="grid lg:grid-cols-2 gap-12">
					<Card>
						<CardContent className="p-6">
							<h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
							<form className="space-y-6">
								<div className="grid sm:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="firstName"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Nombre
										</label>
										<Input id="firstName" required />
									</div>
									<div>
										<label
											htmlFor="lastName"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Apellido
										</label>
										<Input id="lastName" required />
									</div>
								</div>
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Email
									</label>
									<Input id="email" type="email" required />
								</div>
								<div>
									<label
										htmlFor="phone"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Teléfono
									</label>
									<Input id="phone" type="tel" required />
								</div>
								<div>
									<label
										htmlFor="message"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Mensaje
									</label>
									<Textarea id="message" rows={6} required />
								</div>
								<Button
									type="submit"
									className="w-full bg-amber-800 hover:bg-amber-900"
								>
									Enviar Mensaje
								</Button>
							</form>
						</CardContent>
					</Card>

					<div className="space-y-8">
						<Card>
							<CardContent className="p-6">
								<h2 className="text-2xl font-bold mb-6">
									Información de contacto
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
											<h3 className="font-semibold">Teléfono</h3>
											<p className="text-gray-600">+376 804 440</p>
										</div>
									</div>
									<div className="flex items-start">
										<MapPin className="w-6 h-6 text-amber-800 mt-1" />
										<div className="ml-4">
											<h3 className="font-semibold">Dirección</h3>
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
											<h3 className="font-semibold">Horario laboral</h3>
											<p className="text-gray-600">
												Lunes - Viernes: 9:00 - 17:00
												<br />
												Sábado: 10:00 - 13:00
												<br />
												Domingo: Cerrado
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<h2 className="text-2xl font-bold mb-6">Localización</h2>
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
