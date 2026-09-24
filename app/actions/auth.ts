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

// Bcrypt hash of a random string (cost factor 10, matching the cost used for
// real user passwords) with no known plaintext. Compared against on every
// login attempt for an unknown/invalid user so the response takes about the
// same time as a real password check, avoiding a timing side-channel that
// would otherwise leak which usernames exist.
const DUMMY_HASH = "$2b$10$Cn4/7nMuAb.MjVyE6MGLfucJOGLzmyQQiIoViW9mmoETjh5DVQNdm";

export async function login(formData: FormData) {
	const username = formData.get("username");
	const password = formData.get("password");

	try {
		if (typeof username !== "string" || typeof password !== "string") {
			await bcrypt.compare(
				typeof password === "string" ? password : "",
				DUMMY_HASH,
			);
			return { error: "Usuari o contrasenya incorrectes" };
		}

		const user = await sql`SELECT * FROM users WHERE username = ${username}`;

		if (!user.length) {
			await bcrypt.compare(password, DUMMY_HASH);
			return { error: "Usuari o contrasenya incorrectes" };
		}

		const validPassword = await bcrypt.compare(password, user[0].password);

		if (!validPassword) {
			return { error: "Usuari o contrasenya incorrectes" };
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
	return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function logout() {
	(await cookies()).delete(SESSION_COOKIE);
	redirect("/auth/login");
}
