/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // MEMOIVA brand tokens — exact values, do not substitute. See
        // docs/brand-assets/BRAND_BIBLE.md — this file must match it exactly.
        teal: {
          DEFAULT: '#0E7C7B',
          dark: '#0A5E5D',
          // Pale background wash (hover states, card fills) — NOT the brand accent color.
          wash: '#E6F2F2',
          light: '#E6F2F2',
          // The true brand accent — the stylized "I" in the wordmark, focus rings, highlights.
          accent: '#00C4C4',
        },
        navy: { DEFAULT: '#1A2B4C' },
        gold: {
          DEFAULT: '#B8860B',
          // Pale background wash — NOT the brand accent color.
          wash: '#FBF3DF',
          light: '#FBF3DF',
          // The true brand accent — badges, trust dots, highlight text.
          accent: '#E8B84B',
        },
        purple: { DEFAULT: '#7A6BCC' },
        appbg: '#FAF6EC',
        card: '#FFFFFF',
        body: '#1A1A2E',
        muted: '#4A5A6A',
      },
      // MEMOIVA brand fonts, loaded in index.html — matches the marketing site exactly.
      fontFamily: {
        sans: ['Jost', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Bebas Neue', 'sans-serif'],
      },
      minHeight: { tap: '48px' },
      minWidth: { tap: '48px' },
      keyframes: {
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // Reduced-motion is handled globally in index.css (all animations
        // collapse to ~0 duration there), so this stays simple here.
        'card-in': 'card-in .6s ease-out',
      },
    },
  },
  plugins: [],
};
