/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'merkle-blue': '#0077C8',
        'merkle-teal': '#00A5B5',
        'salesforce-blue': '#00A1E0',
        'maturity': {
          lagging: '#E63946',
          siloed: '#F77F00',
          adopting: '#FCBF49',
          scaling: '#90BE6D',
          strategic: '#43AA8B',
          transformed: '#4361EE',
        }
      }
    },
  },
  plugins: [],
}
