/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '135': '1.35',
      },
      gap: {
        '0.25': '0.0625rem',
      },

    },
  },
  plugins: [],
}