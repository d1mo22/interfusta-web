import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const user = request.cookies.get("user");
	const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

	if (isAdminRoute) {
		if (!user?.value) {
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/admin",
		"/admin/:path*", // Añadimos esta línea para incluir todas las rutas que empiezan con /admin/
	],
};
