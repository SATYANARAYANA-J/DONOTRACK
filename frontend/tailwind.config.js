/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4338ca', // Deep Indigo
          hover: '#3730a3',
          light: '#6366f1',
        },
        secondary: {
          DEFAULT: '#f97316', // Accent Orange
          hover: '#ea580c',
        },
        success: {
          DEFAULT: '#10b981', // Teal/Green
          hover: '#059669',
        },
        background: {
          DEFAULT: '#f8fafc', // Soft Slate
          paper: '#ffffff',
        },
        text: {
          primary: '#1e293b',
          secondary: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
