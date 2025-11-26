/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#BE3E82',
        secondary: '#334155',
      },
      fontFamily: {
        // Use metric-matched fallback to eliminate CLS when Inter loads
        // 'Inter Fallback' defined in style.css with size-adjust/ascent-override
        sans: ['Inter', 'Inter Fallback', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
