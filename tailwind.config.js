/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        invitation: {
          darkGreen: '#072b14',
          emerald: '#0c3e1c',
          forest: '#135428',
          lightGreen: '#1b6e36',
          cream: '#f4ede2',
          creamDark: '#eae1d2',
          gold: '#cbb074',
          goldDark: '#9f854b',
          accent: '#114220'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        script: ['Alex Brush', 'Great Vibes', 'Allura', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'envelope-top': '0 12px 25px -4px rgba(0, 0, 0, 0.65), 0 4px 10px rgba(0, 0, 0, 0.4)',
        'envelope-bottom': '0 -10px 25px -4px rgba(0, 0, 0, 0.65)',
        'card': '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3)',
        'stamp': '0 6px 16px rgba(0, 0, 0, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' },
          '50%': { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
