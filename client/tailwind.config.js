/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
    extend: {
      colors: {
        gold: {
          light: '#FDE68A',
          DEFAULT: '#F59E0B',
          dark: '#B45309',
          premium: '#FFD700',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          heavy: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.15)',
        }
      },
      animation: {
        'gold-shine': 'gold-shine 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'gold-shine': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backdropBlur: {
        'premium': '20px',
      }
    },
  },
    plugins: [],
}
