import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        union: {
          blue: "#1e40af",
          red: "#b91c1c",
          gold: "#d97706",
        },
      },
    },
  },
  plugins: [],
};

export default config;
