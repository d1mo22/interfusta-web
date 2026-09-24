/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				// Public Cloudflare R2 bucket URLs (see lib/r2Client.ts /
				// lib/uploadImage.ts: process.env.R2_URL / NEXT_PUBLIC_R2_URL).
				// The account-specific "pub-<hash>" subdomain isn't hardcoded
				// anywhere in the repo (no .env.example committed), so this
				// matches Cloudflare's public-bucket hostname pattern generically.
				protocol: "https",
				hostname: "*.r2.dev",
				port: "",
				pathname: "/**",
			},
		],
	},
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			sharp$: false,
		};
		return config;
	},
	turbopack: {},
	experimental: {
		// app/global-not-found.tsx: a styled 404 for URLs that match no route
		// at all (junk paths), since the multiple root layouts (app/[lang],
		// app/(admin)) mean there's no single app/not-found.tsx above them.
		globalNotFound: true,
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
		];
	},
};

export default nextConfig;
