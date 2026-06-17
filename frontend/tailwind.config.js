/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff8ed',
          100: '#ffefd4',
          200: '#ffdaa8',
          300: '#ffbf71',
          400: '#fd9a38',
          500: '#fb7c0e',
          600: '#e8870a',
          700: '#cf7a09',
          800: '#a85e0c',
          900: '#884e0f',
        },
      },
      fontFamily: {
        sans: [
          'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
          'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'
        ],
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease-out forwards',
        'slide-up':    'slideUp 0.5s ease-out forwards',
        'slide-left':  'slideLeft 0.4s ease-out forwards',
        'marquee':     'marquee 28s linear infinite',
        'float':       'float 4s ease-in-out infinite',
        'spin-slow':   'spin 3s linear infinite',
        'pulse-soft':  'pulseSoft 2.5s ease-in-out infinite',
        'progress':    'progress 1.2s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        progress: {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #fff8ed 0%, #fafaf7 100%)',
        'brand-gradient': 'linear-gradient(135deg, #e8870a 0%, #fb7c0e 100%)',
      },
      boxShadow: {
        'brand': '0 4px 24px rgba(232,135,10,0.25)',
        'brand-lg': '0 8px 40px rgba(232,135,10,0.30)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
