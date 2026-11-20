import { cookies, headers } from "next/headers";
import { dictionaries } from "@/lib/i18n";
import { LOCALE_COOKIE, hasLocale, matchAcceptLanguage } from "@/lib/i18n-config";
import { LoginForm } from "./login-form";

// The admin stays in Catalan, but the browser's own "fill out this field" bubble
// would otherwise follow the browser's language, so it follows the site's instead.
// proxy.ts skips /auth, so a first visit without the cookie falls back to Accept-Language.
export default async function LoginPage() {
	const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
	const lang = hasLocale(cookie) ? cookie : matchAcceptLanguage((await headers()).get("accept-language"));
	const dict = await dictionaries[lang]();
	return <LoginForm requiredMessage={dict.login.required} />;
}
