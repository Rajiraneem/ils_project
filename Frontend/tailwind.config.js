// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        fadeFloat: 'fadeFloat 6s ease-in-out infinite',
        fadeInUp: 'fadeInUp 1s ease-out both',
        fadeIn: 'fadeIn 1.2s ease-out both',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'progress': 'progress 2.5s ease-in-out forwards',
      },
      keyframes: {
        fadeFloat: {
          '0%': { opacity: 0, transform: 'translateY(25px) rotate(0deg)' },
          '20%': { opacity: 1, transform: 'translateY(0) rotate(8deg)' },
          '50%': { transform: 'translateY(-18px) rotate(-8deg)' },
          '100%': { transform: 'translateY(0) rotate(0deg)' },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '80%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'progress': {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
      },
    },
  },
  plugins: [],
}