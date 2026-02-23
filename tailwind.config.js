/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue,html}'
  ],
  // Ensure common color utilities are always generated (safelist)
  safelist: [
    {
      pattern: /^(bg|text|border)-(red|green|blue|slate|gray|purple|indigo|pink|amber|yellow|emerald|teal)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    {
      pattern: /^(bg|text|border)-(blue|purple|slate)-(50|100|200|300|400|500|600|700|800|900)\/?.*$/,
    },
    'text-white', 'text-black', 'bg-white', 'bg-black'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        },
        accent: {
          50: '#f5f3ff',
          500: '#7c3aed'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times']
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        soft: '0 8px 30px rgba(13, 38, 59, 0.12)'
      }
    },
  },
  plugins: [],
}
