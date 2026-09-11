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
        aura: {
          cyan: '#00F0FF',
          violet: '#A855F7',
          pink: '#EC4899',
          amber: '#F59E0B',
          emerald: '#10B981',
          blue: '#3B82F6'
        },
        dark: {
          950: '#030712',
          900: '#0B0F19',
          850: '#111827',
          800: '#1F2937',
          700: '#374151'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 35px -5px rgba(0, 240, 255, 0.5)',
        'glow-violet': '0 0 35px -5px rgba(168, 85, 247, 0.5)',
        'glow-pink': '0 0 35px -5px rgba(236, 72, 153, 0.5)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 5s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
