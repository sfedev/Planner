/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F2',
        sand: '#F2EAE0',
        ink: '#2E2A27',
        muted: '#7A716A',
        terracota: '#C97B5A',
        salvia: '#7E9B7A',
        mostaza: '#D9A441',
        malva: '#9A7AA0',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(46,42,39,0.06), 0 12px 32px rgba(46,42,39,0.08)',
        polaroid: '0 1px 2px rgba(46,42,39,0.10), 0 10px 24px rgba(46,42,39,0.12)',
      },
      keyframes: {
        pop: {
          '0%': { opacity: '0', transform: 'scale(.94) translateY(12px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fade: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        pop: 'pop .35s cubic-bezier(.16,1,.3,1) both',
        fade: 'fade .25s ease-out both',
      },
    },
  },
  plugins: [],
}
