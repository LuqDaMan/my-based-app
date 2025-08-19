import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class'],
  safelist: ['dark'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // OnchainKit theme color mappings
        'ock-primary': 'var(--ock-bg-primary)',
        'ock-primary-hover': 'var(--ock-bg-primary-hover)',
        'ock-primary-active': 'var(--ock-bg-primary-active)',
        'ock-primary-washed': 'var(--ock-bg-primary-washed)',
        'ock-secondary': 'var(--ock-bg-secondary)',
        'ock-default': 'var(--ock-bg-default)',
        'ock-alternate': 'var(--ock-bg-alternate)',
        'ock-inverse': 'var(--ock-bg-inverse)',
        'ock-text-primary': 'var(--ock-text-primary)',
        'ock-text-foreground': 'var(--ock-text-foreground)',
        'ock-text-muted': 'var(--ock-text-foreground-muted)',
        'ock-text-inverse': 'var(--ock-text-inverse)',
        'ock-text-error': 'var(--ock-text-error)',
        'ock-text-success': 'var(--ock-text-success)',
        'ock-text-warning': 'var(--ock-text-warning)',
      },
      borderRadius: {
        'ock': 'var(--ock-border-radius)',
        'ock-inner': 'var(--ock-border-radius-inner)',
      },
      fontFamily: {
        'ock': 'var(--ock-font-family)',
      },
      animation: {
        "fade-out": "1s fadeOut 3s ease-out forwards",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
