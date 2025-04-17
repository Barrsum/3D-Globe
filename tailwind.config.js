// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Scan HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all JS/JSX files in src
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1a202c', // Dark background
        'secondary-dark': '#2d3748', // Slightly lighter dark for cards/popups
        'primary-light': '#ffffff', // Light background
        'secondary-light': '#f7fafc', // Slightly off-white for cards/popups
        'accent': '#3182ce', // Example accent color (blue)
        'accent-dark': '#63b3ed', // Lighter accent for dark mode
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'], // Modern font stack
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards', // Ensure animation runs forward
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' }, // Start slightly scaled down
          '100%': { opacity: 1, transform: 'scale(1)' }, // End at full size
        },
      }
    },
  },
  plugins: [
      require('tailwind-scrollbar'), // Optional: if you want custom scrollbars via plugin
  ],
}