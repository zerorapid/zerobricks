/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563eb", // Professional Blue
          secondary: "#7c3aed", // Industrial Purple
          dark: "#0f172a",
        },
        'app-bg': '#FDFBF6',
        'app-secondary': '#EFE3D3',
        'app-accent': '#D9C4AA',
        'app-blue': '#4F6D88',
        'app-navy': '#26384A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'ui': '15px',
      }
    },
  },
  plugins: [],
}
