"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string>("");

	async function handleSubmit(formData: FormData) {
		const result = await login(formData);

		if (result.error) {
			setError(result.error);
		} else {
			router.push("/admin");
			router.refresh();
		}
	}

	return (
		<div className="min-h-screen pt-16 bg-gray-50">
			<div className="max-w-md mx-auto px-4 py-12">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl text-center">Login</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={handleSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="username"
									className="block text-sm font-medium text-gray-700"
								>
									Username
								</label>
								<Input
									id="username"
									name="username"
									type="text"
									required
									className="mt-1"
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700"
								>
									Password
								</label>
								<Input
									id="password"
									name="password"
									type="password"
									required
									className="mt-1"
								/>
							</div>
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}
							<Button type="submit" className="w-full">
								Login
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
