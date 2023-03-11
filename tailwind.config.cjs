/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '450px',
      ...defaultTheme.screens,
    },
    extend: {
      colors : {
        noir : "#1A1A1A",
        blanc : "#f2f2f2",
        rose : "#ff0032",
        bleu : "#92d8e0",
        orange : "#ff832b",
        violet : "#6C63FF",
      },
      fontFamily : {
        sans : ['Tilt Neon', "sans-serif"],
        jura : ["Jura", "sans-serif"],
        azonix : ['azonix'],
      },
    },
  },
  plugins: [],
}
