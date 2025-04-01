/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom theme colors - easy to change later
        primary: {
          light: '#f5f0e1', // Light wheat
          DEFAULT: '#e6d7b9', // Wheat
          dark: '#d4bc8b', // Darker wheat
        },
        secondary: {
          light: '#d7ccc8', // Light brown
          DEFAULT: '#a1887f', // Brown
          dark: '#795548', // Dark brown
        },
      },
    },
  },
  plugins: [],
}
