// Fetched at runtime from Google's CDN rather than self-hosted: this
// deployment's preview URLs sit behind Vercel Authentication, and font
// requests are always made in anonymous CORS mode (per spec, even for
// same-origin fetches), so they can never carry the SSO session cookie -
// a self-hosted font silently falls back to its fallback face on any
// protected preview. Fetching from fonts.gstatic.com side-steps that.
export function BricolageFontLinks() {
	return (
		<>
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossOrigin="anonymous"
			/>
			<link
				rel="stylesheet"
				href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&display=swap"
			/>
		</>
	);
}
