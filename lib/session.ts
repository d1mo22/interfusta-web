// HMAC-signed session cookie. Uses Web Crypto so it runs in both middleware (edge) and server actions.
export type SessionUser = { id: number; username: string; name: string };

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

const enc = new TextEncoder();

function b64url(bytes: Uint8Array) {
	return btoa(String.fromCharCode(...bytes))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function fromB64url(s: string) {
	const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
	return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function key() {
	const secret = process.env.SESSION_SECRET;
	if (!secret || secret.length < 32) {
		throw new Error("SESSION_SECRET must be set (32+ chars)");
	}
	return crypto.subtle.importKey(
		"raw",
		enc.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign", "verify"],
	);
}

export async function signSession(user: SessionUser) {
	const payload = b64url(
		enc.encode(
			JSON.stringify({ ...user, exp: Date.now() + SESSION_MAX_AGE * 1000 }),
		),
	);
	const sig = await crypto.subtle.sign("HMAC", await key(), enc.encode(payload));
	return `${payload}.${b64url(new Uint8Array(sig))}`;
}

export async function verifySession(
	token: string | undefined,
): Promise<SessionUser | null> {
	if (!token) return null;
	try {
		const [payload, sig] = token.split(".");
		const ok = await crypto.subtle.verify(
			"HMAC",
			await key(),
			fromB64url(sig),
			enc.encode(payload),
		);
		if (!ok) return null;
		const { exp, ...user } = JSON.parse(
			new TextDecoder().decode(fromB64url(payload)),
		);
		return exp > Date.now() ? (user as SessionUser) : null;
	} catch {
		return null;
	}
}
