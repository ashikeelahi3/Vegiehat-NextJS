import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "vegiehat": {
          "primary": "#1E5631",
          "secondary": "#3E885B",
          "accent": "#81B29A",
          "light": "#F2F7F5",
          "tomato": "#C1292E",
          "carrot": "#D96C06",
          "pepper": "#F2CC5B",
          "background": "#F8FAF9",
          "dark": "#173B2F",
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'bounce-short': 'bounce-short 1s ease-in-out',
      },
      keyframes: {
        'bounce-short': {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-3px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
