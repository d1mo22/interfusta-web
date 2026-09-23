import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			paper: 'var(--paper)',
  			stone: 'var(--stone)',
  			ink: {
  				DEFAULT: 'var(--ink)',
  				muted: 'var(--ink-muted)'
  			},
  			hairline: 'var(--hairline)',
  			brand: {
  				DEFAULT: 'var(--brand)',
  				ink: 'var(--brand-ink)',
  				deep: '#C23100'
  			},
  			'on-dark': {
  				DEFAULT: '#F6F5F2',
  				ink: '#171614',
  				line: 'rgba(246,245,242,.22)'
  			},
  			night: '#141312',
  			scrim: {
  				DEFAULT: 'rgba(20,19,18,.72)',
  				soft: 'rgba(10,9,8,.5)'
  			}
  		},
  		fontFamily: {
  			display: ['var(--font-bricolage)', 'ui-sans-serif', 'sans-serif'],
  			sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace']
  		},
  		transitionTimingFunction: {
  			out: 'var(--ease-out)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
