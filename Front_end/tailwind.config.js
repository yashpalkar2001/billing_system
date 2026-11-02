/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: {
      forest: { 950: '#102d27', 900: '#163a32', 800: '#1e5145', 700: '#286858' },
      cream: '#f5f7f4',
      mint: '#e4f3ec'
    },
    boxShadow: { soft: '0 8px 28px rgba(20, 45, 38, 0.06)' }
  }},
  plugins: []
}
