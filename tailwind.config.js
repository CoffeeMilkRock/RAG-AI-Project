/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line scans your files for Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
