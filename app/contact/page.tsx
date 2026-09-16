import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "./contact-form";

export const metadata = {
	title: "Contacte",
	description:
		"Contacti amb Fusteria InterFusta a Santa Coloma, Andorra. Telèfon +376 804 440, interfusta@andorra.ad. Pressupost sense compromís per al seu projecte de fusteria.",
	alternates: {
		canonical: "/contact",
	},
};

export default function ContactPage() {
	return (
		<div className="pt-[72px]">
			<section className="pt-16 pb-12 md:pt-24 md:pb-16">
				<div className="container-site">
					<h1 className="text-4xl md:text-5xl tracking-tight">
						Contacta&apos;ns
					</h1>
					<p className="mt-5 text-lg text-ink-muted max-w-[60ch]">
						Posi&apos;s en contacte amb nosaltres per a qualsevol consulta sobre
						els nostres serveis o per a sobre les necessitats del seu projecte.
					</p>
				</div>
			</section>

			<section className="pb-24 md:pb-32">
				<div className="container-site hairline-t pt-12 grid lg:grid-cols-12 gap-12 lg:gap-16">
					<div className="lg:col-span-7">
						<h2 className="text-2xl tracking-tight mb-8">
							Envia&apos;ns un missatge
						</h2>
						<ContactForm />
					</div>

					<div className="lg:col-span-5">
						<h2 className="text-2xl tracking-tight">
							Informació de contacte
						</h2>
						<dl className="mt-6 hairline-t">
							<div className="grid grid-cols-[24px_1fr] gap-4 py-4 border-b border-hairline">
								<Mail className="h-5 w-5 text-brand-ink mt-0.5" aria-hidden />
								<div>
									<dt className="text-sm text-ink-muted">Email</dt>
									<dd className="mt-1 text-ink">
										<a href="mailto:interfusta@andorra.ad">
											interfusta@andorra.ad
										</a>
									</dd>
								</div>
							</div>
							<div className="grid grid-cols-[24px_1fr] gap-4 py-4 border-b border-hairline">
								<Phone className="h-5 w-5 text-brand-ink mt-0.5" aria-hidden />
								<div>
									<dt className="text-sm text-ink-muted">Telèfon</dt>
									<dd className="mt-1 text-ink">
										<a href="tel:+376804440">+376 804 440</a>
									</dd>
								</div>
							</div>
							<div className="grid grid-cols-[24px_1fr] gap-4 py-4 border-b border-hairline">
								<MapPin className="h-5 w-5 text-brand-ink mt-0.5" aria-hidden />
								<div>
									<dt className="text-sm text-ink-muted">Direcció</dt>
									<dd className="mt-1 text-ink">
										Passatge d&apos;Enclar S/N
										<br />
										Santa Coloma, AD500
										<br />
										Andorra
									</dd>
								</div>
							</div>
							<div className="grid grid-cols-[24px_1fr] gap-4 py-4 border-b border-hairline">
								<Clock className="h-5 w-5 text-brand-ink mt-0.5" aria-hidden />
								<div>
									<dt className="text-sm text-ink-muted">Horari laboral</dt>
									<dd className="mt-1 text-ink">
										Dilluns - Divendres: 9:00 - 17:00
										<br />
										Dissabte: 10:00 - 13:00
										<br />
										Diumenge: Tancat
									</dd>
								</div>
							</div>
						</dl>

						<h2 className="mt-12 text-2xl tracking-tight">Localització</h2>
						<div className="mt-6 relative aspect-[4/3]">
							<iframe
								title="Mapa de la ubicació de Fusteria InterFusta"
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d1.5034337698899677!3d42.49834595869392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a5f58f12d8ead7%3A0x4b992abc827fc509!2sFusteria%20InterFusta%20SL!5e0!3m2!1sen!2sad!4v1705361686744!5m2!1sen!2sad"
								className="absolute inset-0 h-full w-full border-0"
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer"
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
