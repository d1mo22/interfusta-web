/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["placehold.co", `${process.env.CLAUDFLARE_API}`],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.co",
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
};

export default nextConfig;
