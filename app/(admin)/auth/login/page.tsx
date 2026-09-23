"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "lucide-react";
import { Logo } from "@/components/logo";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState("");
	const [isPending, startTransition] = useTransition();

	function handleSubmit(formData: FormData) {
		setError("");
		startTransition(async () => {
			const result = await login(formData);
			if (result.error) {
				setError(result.error);
			} else {
				router.push("/admin");
				router.refresh();
			}
		});
	}

	return (
		<div className="max-w-sm mx-auto px-6 pt-16 pb-[136px]">
			<Link href="/" aria-label="Torna a la web" className="inline-block text-ink">
				<Logo />
			</Link>
			<div className="mt-20">
				<span className="rule" />
				<h1 className="h-display text-[44px] mt-6">Accés al panell</h1>
				<p className="text-ink-muted mt-3">
					Per publicar i editar els projectes de la web.
				</p>
				<form action={handleSubmit} className="flex flex-col gap-8 mt-12">
					<div className="flex flex-col gap-2">
						<label htmlFor="username" className="text-sm font-medium">
							Usuari
						</label>
						<input
							id="username"
							name="username"
							autoComplete="username"
							autoCapitalize="none"
							required
							className="field"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="password" className="text-sm font-medium">
							Contrasenya
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							className="field"
						/>
					</div>
					{error && (
						<p role="alert" className="text-sm text-brand-ink">
							{error}
						</p>
					)}
					<button
						type="submit"
						disabled={isPending}
						className="btn btn-primary h-[54px] text-[17px]"
					>
						{isPending && <Loader className="size-4 animate-spin" />}
						{isPending ? "Entrant…" : "Entra"}
					</button>
				</form>
			</div>
		</div>
	);
}
