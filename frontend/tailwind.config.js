/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          400: '#FFC72C',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        progressBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out forwards',
        progressBar: 'progressBar 2s ease-in-out forwards',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        yellow: '#FFCD11',
        'yellow-dark': '#E6B800',
        black: '#000000',
        'dark-gray': '#231F20',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B6B6B',
        divider: '#E0E0E0',
        success: '#2E7D32',
        warning: '#ED6C02',
        error: '#D32F2F',
      },
    },
  },
  plugins: [],
};
