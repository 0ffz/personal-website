/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{webc,html,js}"],
  theme: {
    fontFamily: {
      'mono': ['"JetBrains Mono"', 'monospace'],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
