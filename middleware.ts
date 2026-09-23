import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function middleware(request: NextRequest) {
	const user = await verifySession(
		request.cookies.get(SESSION_COOKIE)?.value,
	);
	if (user) return NextResponse.next();

	// Las rutas /api solo exigen sesión para operaciones de escritura
	if (request.nextUrl.pathname.startsWith("/api")) {
		if (request.method === "GET") return NextResponse.next();
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
	matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
