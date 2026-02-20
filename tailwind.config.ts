import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        noto: ['var(--font-noto-sans-jp)', 'Noto Sans JP', 'sans-serif'],
        'noto-sans-jp': ['var(--font-noto-sans-jp)', 'Noto Sans JP', 'sans-serif'],
        'inter-sans': ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      fontWeight: {
        demilight: '350',
      },
      screens: {
        'pc': '750px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
} satisfies Config;