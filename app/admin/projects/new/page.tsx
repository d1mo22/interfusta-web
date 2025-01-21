"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createProject } from "@/app/actions/project";
import { ChevronLeft, Plus, X } from "lucide-react";

export default function NewProjectPage() {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const [features, setFeatures] = useState<string[]>([]);
	const [newFeature, setNewFeature] = useState<string>("");

	async function handleSubmit(formData: FormData) {
		formData.append("features", JSON.stringify(features));
		const result = await createProject();

		if (result.error) {
			setError(result.error);
		} else {
			router.push("/admin");
			router.refresh();
		}
	}

	function addFeature() {
		if (newFeature.trim()) {
			setFeatures([...features, newFeature.trim()]);
			setNewFeature("");
		}
	}

	function removeFeature(index: number) {
		setFeatures(features.filter((_, i) => i !== index));
	}

	return (
		<div className="min-h-screen pt-16 bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 py-12">
				<Link href="/admin">
					<Button variant="ghost" className="mb-6">
						<ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
					</Button>
				</Link>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Add New Project</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={handleSubmit} className="space-y-6">
							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="title"
										className="block text-sm font-medium text-gray-700"
									>
										Title
									</label>
									<Input id="title" name="title" required className="mt-1" />
								</div>
								<div>
									<label
										htmlFor="category"
										className="block text-sm font-medium text-gray-700"
									>
										Category
									</label>
									<Select name="category">
										<SelectTrigger>
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="furniture">Furniture</SelectItem>
											<SelectItem value="kitchens">Kitchens</SelectItem>
											<SelectItem value="outdoor">Outdoor</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div>
								<label
									htmlFor="description"
									className="block text-sm font-medium text-gray-700"
								>
									Short Description
								</label>
								<Input
									id="description"
									name="description"
									required
									className="mt-1"
								/>
							</div>

							<div>
								<label
									htmlFor="fullDescription"
									className="block text-sm font-medium text-gray-700"
								>
									Full Description
								</label>
								<Textarea
									id="fullDescription"
									name="fullDescription"
									required
									className="mt-1"
									rows={6}
								/>
							</div>

							<div>
								<label
									htmlFor="features"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Features
								</label>
								<div className="flex gap-2 mb-2">
									<Input
										id="features"
										value={newFeature}
										onChange={(e) => setNewFeature(e.target.value)}
										placeholder="Add a feature"
									/>
									<Button type="button" onClick={addFeature}>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
								<div className="space-y-2">
									{features.map((feature, index) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={`${feature}-${index}`}
											className="flex items-center gap-2 bg-gray-50 p-2 rounded"
										>
											<span className="flex-grow">{feature}</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeFeature(index)}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="completionDate"
										className="block text-sm font-medium text-gray-700"
									>
										Completion Date
									</label>
									<Input
										id="completionDate"
										name="completionDate"
										required
										className="mt-1"
									/>
								</div>
								<div>
									<label
										htmlFor="duration"
										className="block text-sm font-medium text-gray-700"
									>
										Duration
									</label>
									<Input
										id="duration"
										name="duration"
										required
										className="mt-1"
									/>
								</div>
							</div>

							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<div className="flex justify-end gap-4">
								<Link href="/admin">
									<Button variant="outline">Cancel</Button>
								</Link>
								<Button type="submit">Create Project</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
