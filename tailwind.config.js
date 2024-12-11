/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',   // Small mobile
      'sm': '640px',   // Mobile
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large Desktop
      '2xl': '1536px', // Extra Large Desktop
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-in',
        slideIn: 'slideIn 0.5s ease-out',
      },
      spacing: {
        'hamburger': '30px', // Add spacing for hamburger icon
      },
      colors: {
        'menu-bg': '#ffffff', // Background color for the menu
        'menu-text': '#000000', // Text color for the menu
      },
    }
  },
  plugins: [],
}
