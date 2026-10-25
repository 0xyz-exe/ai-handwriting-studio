/** @type {import('tailwindcss').Config} */
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
        ink: {
          blue: "#1e3a8a",
          black: "#18181b",
          red: "#b91c1c",
          pencil: "#4b5563",
          green: "#15803d",
        },
        paper: {
          white: "#ffffff",
          cream: "#fbf8ee",
          vintage: "#f5edd6",
          ruled: "#bfdbfe",
          margin: "#f87171",
        }
      },
    },
  },
  plugins: [],
};
