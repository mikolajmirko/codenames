const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      main: {
        100: '#2D2D48',
        200: '#202137',
        300: '#161726'
      },
      gray: colors.gray,
      blue: colors.indigo,
      red: colors.pink,
      amber: colors.amber,
      team: {
        spectator: colors.blueGray[400],
        blue: colors.indigo[500],
        red: colors.pink[600],
        hover: {
          spectator: colors.blueGray[500],
          blue: colors.indigo[600],
          red: colors.pink[700]
        },
      },
      warning: colors.amber,
      success: colors.lime
    },
    fontFamily: {
      'sans': ['Roboto', 'Arial', 'ui-sans-serif'],
      'header': ['Junegull']
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
