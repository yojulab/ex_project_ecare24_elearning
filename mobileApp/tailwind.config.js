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
        silver: {
          bg: '#f8fafc',
          darkBg: '#090d16',
          primary: '#1d4ed8',
          accent: '#f59e0b',
          card: '#ffffff',
          darkCard: '#1e293b',
          highContrastText: '#000000',
          highContrastBg: '#ffffff',
          highContrastBorder: '#000000',
        }
      },
      fontSize: {
        'silver-sm': '16px',
        'silver-base': '18px',
        'silver-lg': '22px',
        'silver-xl': '26px',
        'silver-2xl': '32px',
      },
      minHeight: {
        'touch': '48px',
        'touch-lg': '56px',
      },
      minWidth: {
        'touch': '48px',
        'touch-lg': '56px',
      }
    },
  },
  plugins: [],
};
