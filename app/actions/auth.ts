"use server";

import { sql } from "@/app/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function login(formData: FormData) {
	const username = formData.get("username");
	const password = formData.get("password");

	try {
		const user = await sql`SELECT * FROM users WHERE username = ${username}`;

		if (!user.length) {
			return { error: "Usuario no encontrado" };
		}

		const validPassword = await bcrypt.compare(
			password as string,
			user[0].password,
		);

		if (!validPassword) {
			return { error: "Contraseña incorrecta" };
		}

		(await cookies()).set(
			"user",
			JSON.stringify({
				id: user[0].id,
				username: user[0].username,
				role: user[0].role,
			}),
			{
				secure: true,
				httpOnly: true,
				sameSite: "strict",
			},
		);

		return { success: true };
	} catch (error) {
		console.error(error);
		return { error: "Error al iniciar sesión" };
	}
}

export async function getCurrentUser() {
	const userCookie = (await cookies()).get("user");
	if (!userCookie) return null;

	try {
		return JSON.parse(userCookie.value);
	} catch {
		return null;
	}
}
