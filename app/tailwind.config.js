/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // MEMOIVA brand tokens — exact values, do not substitute.
        teal: { DEFAULT: '#0E7C7B', dark: '#0A5E5D', light: '#E6F2F2' },
        navy: { DEFAULT: '#1A2B4C' },
        gold: { DEFAULT: '#B8860B', light: '#FBF3DF' },
        appbg: '#F8F9FA',
        card: '#FFFFFF',
        body: '#1A1A2E',
      },
      // Clean, highly-legible sans-serif system stack.
      // NOTE: the MEMOIVA marketing site uses Bebas Neue / Cormorant Garamond / Jost
      // from Google Fonts — load those here later if brand match is wanted.
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      minHeight: { tap: '48px' },
      minWidth: { tap: '48px' },
    },
  },
  plugins: [],
};
