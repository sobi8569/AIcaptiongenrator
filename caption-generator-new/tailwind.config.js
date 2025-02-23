/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ff9d',
        background: '#0a0a0a',
        text: '#ffffff',
        card: 'rgba(255, 255, 255, 0.05)',
        glow: 'rgba(0, 255, 157, 0.2)',
      },
      animation: {
        'float': 'float 4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(-50%, -50%) scale(0.5)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { 
            transform: 'translate(calc(-50% + var(--x-offset)), calc(-50% + var(--y-offset))) scale(1)',
            opacity: '0'
          },
        },
      },
    },
  },
  plugins: [],
}
