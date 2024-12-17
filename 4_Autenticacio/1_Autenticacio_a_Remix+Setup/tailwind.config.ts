import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", "sans-serif"], // Defineix Rubik com a font predeterminada
      },
    },
  },
  plugins: [],
} satisfies Config;
