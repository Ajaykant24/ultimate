import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: ["class", ".dark"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0f1010',
          card: '#1a1c1c',
          elevated: '#222424',
        },
        border: {
          DEFAULT: '#2a2d2d',
        },
        text: {
          primary: '#ffffff',
          secondary: '#9ca3af',
        },
        accent: {
          green: {
            DEFAULT: '#84cc16',
            bright: '#a3e635',
          },
        },
        status: {
          red: '#ef4444',
          yellow: '#f59e0b',
          green: '#22c55e',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
