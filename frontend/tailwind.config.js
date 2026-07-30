/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
