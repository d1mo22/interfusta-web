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
	"https://www.google.com/maps?q=Fusteria+InterFusta+SL&ftid=0x12a5f58f12d8ead7:0x4b992abc827fc509";

const fieldClass = (hasError: boolean) =>
	`rounded-none border-0 border-b ${
		hasError ? "border-brand-ink" : "border-hairline"
	} bg-transparent px-0 h-[46px] text-base placeholder:text-ink-muted focus-visible:ring-0 focus-visible:border-brand shadow-none`;

const FIELDS = ["firstName", "lastName", "email", "phone", "message"] as const;
type FieldName = (typeof FIELDS)[number];

function validate(name: FieldName, value: string): string {
	const trimmed = value.trim();

	switch (name) {
		case "firstName":
			return trimmed ? "" : "Indica el teu nom";
		case "lastName":
			return trimmed ? "" : "Indica el teu cognom";
		case "email": {
			if (!trimmed) return "Introdueix un correu vàlid";
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(trimmed) ? "" : "Introdueix un correu vàlid";
		}
		case "phone": {
			if (!trimmed) return "Indica el teu telèfon";
			const digitCount = (trimmed.replace(/[\s+\-()]/g, "").match(/\d/g) || [])
				.length;
			return digitCount >= 6 ? "" : "Introdueix un telèfon vàlid";
		}
		case "message":
			return trimmed ? "" : "Escriu el teu missatge";
		default:
			return "";
	}
}

export default function ContactPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>(
		{},
	);

	function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setErrors((prev) => ({
			...prev,
			[name]: validate(name as FieldName, value),
		}));
	}

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) {
		const { name, value } = e.target;
		setErrors((prev) => {
			if (!prev[name as FieldName]) return prev;
			return { ...prev, [name]: validate(name as FieldName, value) };
		});
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);

		const newErrors: Partial<Record<FieldName, string>> = {};
		for (const field of FIELDS) {
			const value = String(formData.get(field) ?? "");
			const fieldError = validate(field, value);
			if (fieldError) newErrors[field] = fieldError;
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			const firstInvalid = FIELDS.find((field) => newErrors[field]);
			if (firstInvalid) {
				const el = form.elements.namedItem(firstInvalid);
				if (el instanceof HTMLElement) el.focus();
			}
			return;
		}

		setIsSubmitting(true);
		setError(null);
		setSuccess(false);

		try {
			const result = await createContact(formData);

			if (result.error) {
				setError(result.error);
			} else {
				setSuccess(true);
				setErrors({});
				form.reset();
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
						noValidate
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
									onBlur={handleBlur}
									onChange={handleChange}
									aria-invalid={!!errors.firstName}
									aria-describedby={
										errors.firstName ? "firstName-error" : undefined
									}
									className={fieldClass(!!errors.firstName)}
								/>
								{errors.firstName && (
									<p id="firstName-error" className="text-brand-ink text-[13px]">
										{errors.firstName}
									</p>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="lastName" className="text-sm font-medium">
									Cognom
								</Label>
								<Input
									id="lastName"
									name="lastName"
									required
									onBlur={handleBlur}
									onChange={handleChange}
									aria-invalid={!!errors.lastName}
									aria-describedby={
										errors.lastName ? "lastName-error" : undefined
									}
									className={fieldClass(!!errors.lastName)}
								/>
								{errors.lastName && (
									<p id="lastName-error" className="text-brand-ink text-[13px]">
										{errors.lastName}
									</p>
								)}
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
									placeholder="interfusta@interfusta.ad"
									onBlur={handleBlur}
									onChange={handleChange}
									aria-invalid={!!errors.email}
									aria-describedby={errors.email ? "email-error" : undefined}
									className={fieldClass(!!errors.email)}
								/>
								{errors.email && (
									<p id="email-error" className="text-brand-ink text-[13px]">
										{errors.email}
									</p>
								)}
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
									onBlur={handleBlur}
									onChange={handleChange}
									aria-invalid={!!errors.phone}
									aria-describedby={errors.phone ? "phone-error" : undefined}
									className={fieldClass(!!errors.phone)}
								/>
								{errors.phone && (
									<p id="phone-error" className="text-brand-ink text-[13px]">
										{errors.phone}
									</p>
								)}
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
								onBlur={handleBlur}
								onChange={handleChange}
								aria-invalid={!!errors.message}
								aria-describedby={errors.message ? "message-error" : undefined}
								className={`${fieldClass(!!errors.message)} min-h-[150px] pt-2.5`}
							/>
							{errors.message && (
								<p id="message-error" className="text-brand-ink text-[13px]">
									{errors.message}
								</p>
							)}
						</div>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="btn-press rounded-none h-[54px] px-[30px] bg-brand text-on-dark text-[19px] font-bold hover:bg-brand-deep hover:text-on-dark self-start"
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

					<aside className="relative overflow-hidden min-h-[560px] flex flex-col justify-end text-on-dark">
						<Image
							src="/thumbnail.webp"
							alt="Andorra la Vella"
							fill
							className="object-cover"
							sizes="(min-width: 1024px) 40vw, 100vw"
						/>
						<div className="absolute inset-0 bg-scrim" />
						<div className="relative p-10">
							<h2 className="h-display text-[30px] mb-6">
								El <span className="text-brand">taller</span>
							</h2>
							<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-on-dark-line">
								<span className="text-sm opacity-70">Email</span>
								<span className="font-mono text-sm">
									interfusta@interfusta.ad
								</span>
							</div>
							<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-on-dark-line">
								<span className="text-sm opacity-70">Telèfon</span>
								<span className="font-mono text-sm">+376 804 440</span>
							</div>
							<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-on-dark-line">
								<span className="text-sm opacity-70">Adreça</span>
								<span className="text-base">
									Passatge d&apos;Enclar S/N
									<br />
									Santa Coloma, AD500, Andorra
								</span>
							</div>
							<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-b border-on-dark-line">
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
								className="block underline decoration-brand decoration-2 underline-offset-[6px] pt-7 self-start"
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
