/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Merkle Brand
        'merkle-blue': '#0057A3',
        'merkle-cyan': '#00B5E2',
        'merkle-teal': '#00A5B5',
        'merkle-dark': '#1A1A1A',
        // Salesforce
        'salesforce-blue': '#00A1E0',
        // Maturity levels
        'maturity': {
          lagging: '#DC2626',
          siloed: '#EA580C',
          adopting: '#D97706',
          scaling: '#65A30D',
          strategic: '#0D9488',
          transformed: '#4F46E5',
        },
        // Phase colors
        'phase': {
          1: '#0057A3',
          2: '#EA580C',
          3: '#059669',
          4: '#7C3AED',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'merkle': '0 4px 14px 0 rgba(0, 87, 163, 0.15)',
        'merkle-lg': '0 10px 25px 0 rgba(0, 87, 163, 0.2)',
      }
    },
  },
  plugins: [],
}
