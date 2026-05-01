/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#FF4D00',
        'accent-glow': '#ff3333',
        'wuxing-mu': '#4ade80',
        'wuxing-huo': '#FF4D00',
        'wuxing-tu': '#d4a574',
        'wuxing-jin': '#cbd5e1',
        'wuxing-shui': '#60a5fa',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        eng: ['"Cinzel"', 'serif'],
      },
    },
  },
  plugins: [],
};
