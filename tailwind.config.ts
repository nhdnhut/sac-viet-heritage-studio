import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lacquer: {
          900: "#360608",
          800: "#540B0E",
          700: "#800E13",
          600: "#9E2A2B",
          500: "#BF360C",
          400: "#D35400",
        },
        imperial: {
          900: "#6B4E00",
          800: "#8C6800",
          700: "#B8860B",
          600: "#D4AF37",
          500: "#F3C64F",
          400: "#FDE047",
        },
        indigoStone: {
          900: "#0B192C",
          800: "#1E3E62",
          700: "#1D3557",
          600: "#457B9D",
        },
        jade: {
          900: "#0D2818",
          800: "#143625",
          700: "#1B4931",
          600: "#2D6A4F",
          500: "#40916C",
        },
        parchment: {
          50: "#FFFDF7",
          100: "#FBF7ED",
          200: "#F4ECD8",
          300: "#E5D8BC",
        },
        silkDark: {
          950: "#0B0909",
          900: "#131010",
          850: "#1A1616",
          800: "#241F1F",
          700: "#383131",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
