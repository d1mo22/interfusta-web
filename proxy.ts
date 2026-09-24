import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import { LOCALE_COOKIE, resolveLocale } from "@/lib/i18n-config";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return guard(request);
	return localize(request);
}

// Admin pages and write APIs need a valid session (unchanged behaviour).
async function guard(request: NextRequest) {
	const user = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
	if (user) return NextResponse.next();

	// Las rutas /api solo exigen sesión para operaciones de escritura
	if (request.nextUrl.pathname.startsWith("/api")) {
		if (request.method === "GET") return NextResponse.next();
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	return NextResponse.redirect(new URL("/auth/login", request.url));
}

// Public pages: Catalan is served unprefixed (rewritten to app/[lang]=ca), other
// languages live under /xx. The decision logic lives in lib/i18n-config.ts.
function localize(request: NextRequest) {
	const decision = resolveLocale(
		request.nextUrl.pathname,
		request.cookies.get(LOCALE_COOKIE)?.value,
		request.headers.get("accept-language"),
	);
	if (decision.action === "next") return NextResponse.next();

	const url = request.nextUrl.clone(); // keeps the query string
	url.pathname = decision.pathname;
	const response =
		decision.action === "rewrite"
			? NextResponse.rewrite(url)
			: NextResponse.redirect(url, decision.permanent ? 308 : 307);
	if (decision.setCookie)
		response.cookies.set(LOCALE_COOKIE, decision.setCookie, {
			path: "/",
			maxAge: ONE_YEAR,
			sameSite: "lax",
		});
	return response;
}

export const config = {
	matcher: [
		"/admin",
		"/admin/:path*",
		"/api/:path*",
		// Public pages: everything except Next internals, admin/auth/api and files
		// with an extension (public/ assets, sitemap.xml, robots.txt, the Google
		// verification .html files).
		"/((?!_next|api|admin|auth|.*\\..*).*)",
	],
};
