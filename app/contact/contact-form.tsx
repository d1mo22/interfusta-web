"use client";

import { useState } from "react";
import { createContact } from "@/app/actions/contact";
import { Loader } from "lucide-react";

export default function ContactForm() {
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setPending(true);
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
			setError("S'ha produït un error en enviar el missatge.");
		} finally {
			setPending(false);
		}
	}

	return (
		<form className="grid gap-8" onSubmit={handleSubmit}>
			<div className="grid sm:grid-cols-2 gap-8">
				<div>
					<label className="block text-sm text-ink-muted" htmlFor="firstName">
						Nom
					</label>
					<input className="field" id="firstName" name="firstName" required />
				</div>
				<div>
					<label className="block text-sm text-ink-muted" htmlFor="lastName">
						Cognom
					</label>
					<input className="field" id="lastName" name="lastName" required />
				</div>
			</div>
			<div>
				<label className="block text-sm text-ink-muted" htmlFor="email">
					Email
				</label>
				<input
					className="field"
					id="email"
					name="email"
					type="email"
					required
					placeholder="interfusta@andorra.ad"
				/>
			</div>
			<div>
				<label className="block text-sm text-ink-muted" htmlFor="phone">
					Telèfon
				</label>
				<input
					className="field"
					id="phone"
					name="phone"
					type="tel"
					required
					placeholder="+376 804 440"
				/>
			</div>
			<div>
				<label className="block text-sm text-ink-muted" htmlFor="message">
					Missatge
				</label>
				<textarea
					className="field resize-y min-h-[160px]"
					id="message"
					name="message"
					rows={6}
					required
					placeholder="Expliqui'ns en què podem ajudar-lo. Detalli el seu projecte o consulta..."
				/>
			</div>
			<div>
				<button type="submit" className="btn btn-primary" disabled={pending}>
					{pending ? (
						<>
							<Loader className="h-4 w-4 animate-spin" aria-hidden />
							Enviant...
						</>
					) : (
						"Enviar Missatge"
					)}
				</button>
				{error && (
					<p className="mt-4 text-sm text-ink" role="status">
						{error}
					</p>
				)}
				{success && (
					<p className="mt-4 text-sm text-brand-ink" role="status">
						Missatge enviat correctament. Ens posarem en contacte amb vostè el
						més aviat possible.
					</p>
				)}
			</div>
		</form>
	);
}
