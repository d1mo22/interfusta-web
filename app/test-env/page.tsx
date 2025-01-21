"use client";
import { useState, useEffect } from "react";

export default function TestEnvPage() {
	const [connectionStatus, setConnectionStatus] =
		useState<string>("Comprobando...");

	useEffect(() => {
		async function testConnection() {
			try {
				const response = await fetch("/api/test-connection");
				const data = await response.json();

				if (data.success) {
					setConnectionStatus("✅ Conexión exitosa");
				} else {
					setConnectionStatus(`❌ Error: ${data.error}`);
				}
			} catch (error) {
				console.log(error);
				setConnectionStatus("❌ Error al probar conexión");
			}
		}

		testConnection();
	}, []);

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Test de Conexión</h1>
			<div className="space-y-4">
				<div className="bg-gray-100 p-4 rounded">
					<p className="font-mono">{connectionStatus}</p>
				</div>
			</div>
		</div>
	);
}
