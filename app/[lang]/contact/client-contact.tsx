"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createContact } from "@/app/actions/contact";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";
import { Accent } from "@/components/accent";
import { RichText } from "@/components/rich-text";
import { localeHref, type Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/i18n";

const MAPS_URL =
	"https://www.google.com/maps?q=Fusteria+InterFusta+SL&ftid=0x12a5f58f12d8ead7:0x4b992abc827fc509";

const fieldClass = (hasError: boolean) =>
	`rounded-none border-0 border-b ${
		hasError ? "border-brand-ink" : "border-hairline"
	} bg-transparent px-0 h-[46px] text-base placeholder:text-ink-muted focus-visible:ring-0 focus-visible:border-brand shadow-none`;

const FIELDS = ["firstName", "lastName", "email", "phone", "message"] as const;
type FieldName = (typeof FIELDS)[number];

function validate(name: FieldName, value: string, errors: Dictionary["contact"]["errors"]): string {
	const trimmed = value.trim();

	switch (name) {
		case "firstName":
			return trimmed ? "" : errors.firstName;
		case "lastName":
			return trimmed ? "" : errors.lastName;
		case "email": {
			if (!trimmed) return errors.email;
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(trimmed) ? "" : errors.email;
		}
		case "phone": {
			if (!trimmed) return errors.phone;
			const digitCount = (trimmed.replace(/[\s+\-()]/g, "").match(/\d/g) || []).length;
			return digitCount >= 6 ? "" : errors.phoneInvalid;
		}
		case "message":
			return trimmed ? "" : errors.message;
		default:
			return "";
	}
}

export default function ClientContact({
	lang,
	dict,
	schedule,
	hoursLabel,
}: {
	lang: Locale;
	dict: Dictionary["contact"];
	schedule: string[];
	hoursLabel: string;
}) {
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
			[name]: validate(name as FieldName, value, dict.errors),
		}));
	}

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) {
		const { name, value } = e.target;
		setErrors((prev) => {
			if (!prev[name as FieldName]) return prev;
			return { ...prev, [name]: validate(name as FieldName, value, dict.errors) };
		});
	}

	const handlers = { onBlur: handleBlur, onChange: handleChange };

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);

		const newErrors: Partial<Record<FieldName, string>> = {};
		for (const field of FIELDS) {
			const value = String(formData.get(field) ?? "");
			const fieldError = validate(field, value, dict.errors);
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
				setError(dict.errors.send);
			} else {
				setSuccess(true);
				setErrors({});
				form.reset();
			}
		} catch (error) {
			console.log(error);
			setError(dict.errors.send);
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
						title={<Accent text={dict.title} />}
						intro={dict.intro}
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
							<ContactField name="firstName" label={dict.labels.firstName} error={errors.firstName} {...handlers} />
							<ContactField name="lastName" label={dict.labels.lastName} error={errors.lastName} {...handlers} />
						</div>
						<div className="grid md:grid-cols-2 gap-8">
							<ContactField
								name="email"
								label={dict.labels.email}
								type="email"
								placeholder={dict.emailPlaceholder}
								error={errors.email}
								{...handlers}
							/>
							<ContactField
								name="phone"
								label={dict.labels.phone}
								type="tel"
								placeholder="+376 XXX XXX"
								error={errors.phone}
								{...handlers}
							/>
						</div>
						<ContactField
							name="message"
							label={dict.labels.message}
							multiline
							placeholder={dict.messagePlaceholder}
							error={errors.message}
							{...handlers}
						/>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="btn-press rounded-none h-[54px] px-[30px] bg-brand text-on-dark text-[19px] font-bold hover:bg-brand-deep hover:text-on-dark self-start"
						>
							{isSubmitting ? (
								<>
									<Loader className="mr-2 h-4 w-4 animate-spin [animation-duration:.6s]" />
									{dict.sending}
								</>
							) : (
								dict.submit
							)}
						</Button>
						<p className="text-[13px] text-ink-muted">
							<RichText
								text={dict.consent}
								slots={{
									link: (
										<Link
											href={localeHref(lang, "/privacitat")}
											className="underline underline-offset-2 hover:text-ink"
										>
											{dict.consentLink}
										</Link>
									),
								}}
							/>
						</p>
						{error && (
							<p role="alert" className="text-sm text-brand-ink">
								{error}
							</p>
						)}
						{success && (
							<p role="status" className="text-sm">
								{dict.success}
							</p>
						)}
					</form>

					<WorkshopCard dict={dict} schedule={schedule} hoursLabel={hoursLabel} />
				</div>
			</section>

			<section className="pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<iframe
						src={`${MAPS_URL}&output=embed`}
						title={dict.mapTitle}
						className="w-full h-[420px] border-0 grayscale-[20%]"
						loading="lazy"
						sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
			</section>
		</div>
	);
}

type FieldHandlers = {
	onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function ContactField({
	name,
	label,
	error,
	multiline,
	type,
	placeholder,
	onBlur,
	onChange,
}: FieldHandlers & {
	name: FieldName;
	label: string;
	error?: string;
	multiline?: boolean;
	type?: string;
	placeholder?: string;
}) {
	const props = {
		id: name,
		name,
		required: true,
		placeholder,
		onBlur,
		onChange,
		"aria-invalid": !!error,
		"aria-describedby": error ? `${name}-error` : undefined,
	};
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={name} className="text-sm font-medium">
				{label}
			</Label>
			{multiline ? (
				<Textarea
					{...props}
					rows={6}
					className={`${fieldClass(!!error)} min-h-[150px] pt-2.5`}
				/>
			) : (
				<Input {...props} type={type} className={fieldClass(!!error)} />
			)}
			{error && (
				<p id={`${name}-error`} className="text-brand-ink text-[13px]">
					{error}
				</p>
			)}
		</div>
	);
}

function WorkshopCard({
	dict,
	schedule,
	hoursLabel,
}: {
	dict: Dictionary["contact"];
	schedule: string[];
	hoursLabel: string;
}) {
	return (
		<aside className="relative overflow-hidden min-h-[560px] flex flex-col justify-end text-on-dark">
			<Image
				src="/thumbnail.webp"
				alt={dict.workshop.imageAlt}
				fill
				className="object-cover"
				sizes="(min-width: 1024px) 40vw, 100vw"
			/>
			<div className="absolute inset-0 bg-scrim" />
			<div className="relative p-10">
				<h2 className="h-display text-[30px] mb-6">
					<Accent text={dict.workshop.title} />
				</h2>
				<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-on-dark-line">
					<span className="text-sm opacity-70">{dict.labels.email}</span>
					<span className="font-mono text-sm">interfusta@interfusta.ad</span>
				</div>
				<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-on-dark-line">
					<span className="text-sm opacity-70">{dict.labels.phone}</span>
					<span className="font-mono text-sm">+376 804 440</span>
				</div>
				<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-on-dark-line">
					<span className="text-sm opacity-70">{dict.workshop.address}</span>
					<span className="font-mono text-sm">
						Passatge d&apos;Enclar S/N
						<br />
						Santa Coloma, AD500, Andorra
					</span>
				</div>
				<div className="grid grid-cols-[96px_1fr] gap-6 py-[18px] border-t border-b border-on-dark-line">
					<span className="text-sm opacity-70">{hoursLabel}</span>
					<span className="font-mono text-sm leading-[1.8]">
						{schedule.map((line) => (
							<span key={line} className="block">
								{line}
							</span>
						))}
					</span>
				</div>
				<a
					href={MAPS_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="block underline decoration-brand decoration-2 underline-offset-[6px] pt-7 self-start"
				>
					{dict.workshop.map}
				</a>
			</div>
		</aside>
	);
}
