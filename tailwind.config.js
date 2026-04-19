/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E53E3E',
        surface: '#111111',
        background: '#0A0A0A',
        'border-dark': '#222222',
        success: '#48BB78',
        warning: '#ECC94B',
        danger: '#F56565',
        info: '#63B3ED',
      },
    },
  },
  plugins: [],
}
