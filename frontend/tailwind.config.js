/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xs': '0.6rem',      // 9.6px (era 12px)
        'sm': '0.7rem',      // 11.2px (era 14px)
        'base': '0.8rem',    // 12.8px (era 16px)
        'lg': '0.9rem',      // 14.4px (era 18px)
        'xl': '1rem',        // 16px (era 20px)
        '2xl': '1.2rem',     // 19.2px (era 24px)
        '3xl': '1.5rem',     // 24px (era 30px)
      },
      spacing: {
        '1': '0.32rem',   // ~5px (era 4px, mas ajustado para 20% menor)
        '2': '0.64rem',   // ~10px (era 8px)
        '3': '0.96rem',   // ~15px (era 12px)
        '4': '1.28rem',   // ~20px (era 16px)
        '5': '1.6rem',    // ~26px (era 20px)
        '6': '1.92rem',   // ~31px (era 24px)
        '8': '2.56rem',   // ~41px (era 32px)
        '9': '2.88rem',   // ~46px (era 36px)
        '10': '3.2rem',   // ~51px (era 40px)
        '12': '3.84rem',  // ~61px (era 48px)
        '16': '5.12rem',  // ~82px (era 64px)
      },
    },
  },
  plugins: [],
}
