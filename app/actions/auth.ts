"use server";

import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import {
	SESSION_COOKIE,
	SESSION_MAX_AGE,
	signSession,
	verifySession,
} from "@/lib/session";

export async function login(formData: FormData) {
	const username = formData.get("username");
	const password = formData.get("password");

	try {
		const user = await sql`SELECT * FROM users WHERE username = ${username}`;

		if (!user.length) {
			return { error: "Usuari no trobat" };
		}

		const validPassword = await bcrypt.compare(
			password as string,
			user[0].password,
		);

		if (!validPassword) {
			return { error: "Contrasenya incorrecta" };
		}

		(await cookies()).set(
			SESSION_COOKIE,
			await signSession({
				id: user[0].id,
				username: user[0].username,
				name: user[0].name,
			}),
			{
				secure: true,
				httpOnly: true,
				sameSite: "strict",
				path: "/",
				maxAge: SESSION_MAX_AGE,
			},
		);

		return { success: true };
	} catch (error) {
		console.error(error);
		return { error: "Error en iniciar sessió" };
	}
}

export async function getCurrentUser() {
	return verifySession(cookies().get(SESSION_COOKIE)?.value);
}

export async function logout() {
	cookies().delete(SESSION_COOKIE);
	redirect("/auth/login");
}
