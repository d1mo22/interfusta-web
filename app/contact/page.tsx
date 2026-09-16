"use client";

import { useState } from "react";
import Image from "next/image";
import { createContact } from "@/app/actions/contact";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";

const MAPS_URL =
	"https://www.google.com/maps?q=Passatge%20d'Enclar%20S%2FN%2C%20Santa%20Coloma%2C%20AD500%2C%20Andorra";

const fieldClass =
	"rounded-none border-0 border-b border-hairline bg-transparent px-0 h-[46px] text-base placeholder:text-ink-muted focus-visible:ring-0 focus-visible:border-brand shadow-none";

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
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading
						title={
							<>
								Contacta&apos;<span className="text-brand">ns</span>
							</>
						}
						intro="Posi's en contacte amb nosaltres per a qualsevol consulta sobre els nostres serveis o per a sobre les necessitats del seu projecte."
					/>
				</div>
			</section>

			<section className="pt-4 pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid lg:grid-cols-[7fr_5fr] gap-24 items-start">
					<form
						className="flex flex-col gap-9 pt-6"
						onSubmit={handleSubmit}
					>
						<div className="grid md:grid-cols-2 gap-8">
							<div className="flex flex-col gap-2">
								<Label htmlFor="firstName" className="text-sm font-medium">
									Nom
								</Label>
								<Input
									id="firstName"
									name="firstName"
									required
									className={fieldClass}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="lastName" className="text-sm font-medium">
									Cognom
								</Label>
								<Input
									id="lastName"
									name="lastName"
									required
									className={fieldClass}
								/>
							</div>
						</div>
						<div className="grid md:grid-cols-2 gap-8">
							<div className="flex flex-col gap-2">
								<Label htmlFor="email" className="text-sm font-medium">
									Email
								</Label>
								<Input
									id="email"
									name="email"
									type="email"
									required
									placeholder="interfusta@andorra.ad"
									className={fieldClass}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="phone" className="text-sm font-medium">
									Telèfon
								</Label>
								<Input
									id="phone"
									name="phone"
									type="tel"
									required
									placeholder="+376 804 440"
									className={fieldClass}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="message" className="text-sm font-medium">
								Missatge
							</Label>
							<Textarea
								id="message"
								name="message"
								rows={6}
								required
								placeholder="Expliqui'ns en què podem ajudar-lo. Detalli el seu projecte o consulta..."
								className={`${fieldClass} min-h-[150px] pt-2.5`}
							/>
						</div>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="btn-press rounded-none h-[54px] px-[30px] bg-brand text-[#171614] hover:bg-[#C23100] hover:text-[#F6F5F2] self-start"
						>
							{isSubmitting ? (
								<>
									<Loader className="mr-2 h-4 w-4 animate-spin [animation-duration:.6s]" />
									Enviant...
								</>
							) : (
								"Enviar missatge"
							)}
						</Button>
						{error && (
							<p role="alert" className="text-sm text-brand-ink">
								{error}
							</p>
						)}
						{success && (
							<p role="status" className="text-sm">
								Missatge enviat correctament. Ens posarem en contacte amb
								vostè el més aviat possible.
							</p>
						)}
					</form>

					<aside className="relative overflow-hidden min-h-[560px] flex flex-col justify-end text-[#F6F5F2]">
						<Image
							src="/thumbnail.webp"
							alt="Andorra la Vella"
							fill
							className="object-cover"
							sizes="(min-width: 1024px) 40vw, 100vw"
						/>
						<div className="absolute inset-0 bg-[rgba(20,19,18,.72)]" />
						<div className="relative p-10">
							<h2 className="h-display text-[30px] mb-6">
								El <span className="text-brand">taller</span>
							</h2>
							<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-[rgba(246,245,242,.22)]">
								<span className="text-sm opacity-70">Email</span>
								<span className="font-mono text-sm">
									interfusta@andorra.ad
								</span>
							</div>
							<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-[rgba(246,245,242,.22)]">
								<span className="text-sm opacity-70">Telèfon</span>
								<span className="font-mono text-sm">+376 804 440</span>
							</div>
							<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-[rgba(246,245,242,.22)]">
								<span className="text-sm opacity-70">Adreça</span>
								<span className="text-base">
									Passatge d&apos;Enclar S/N
									<br />
									Santa Coloma, AD500, Andorra
								</span>
							</div>
							<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-b border-[rgba(246,245,242,.22)]">
								<span className="text-sm opacity-70">Horari</span>
								<span className="font-mono text-sm leading-[1.8]">
									Dilluns - Divendres 9:00 - 17:00
									<br />
									Dissabte 10:00 - 13:00
									<br />
									Diumenge tancat
								</span>
							</div>
							<a
								href={MAPS_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="underline decoration-brand decoration-2 underline-offset-[6px] mt-7 self-start"
							>
								Obrir a Google Maps
							</a>
						</div>
					</aside>
				</div>
			</section>
		</div>
	);
}
