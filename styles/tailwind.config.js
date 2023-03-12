const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    // 'site/**/*.html',
    './site/notes/*.md',
    './site/**/*.njk',
    './site/index.njk',
  ],
  safelist: [],
  plugins: [
    require('@tailwindcss/typography'),
  ],
  theme: {
    fontFamily: {
      markipediaSerif: ['Linux Libertine', 'Georgia', 'Times', 'serif'],
      markipediaSans: 'sans-serif',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      gray: colors.gray,
      white: colors.white,
      green: colors.green,
      emerald: colors.emerald,
      blue: colors.blue,
      indigo: colors.indigo,
      yellow: colors.yellow,
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'h1,h2,h3,h4,h5,h6': {
              fontFamily: ['sans-serif'],
              fontWeight: theme('fontWeight.700'),
            },
            'h1,h2': {
              fontFamily: ['Linux Libertine', 'Georgia', 'Times', 'serif'],
              fontWeight: theme('fontWeight.400'),
              borderBottom: (
                theme('borderWidth.DEFAULT') + ' '
                + theme('borderStyle.solid') + ' '
                + theme('colors.gray.200')
              ),
            },
            'a': { 'color': theme('colors.blue.900') },
            'a:hover': { 'color': theme('colors.blue.600') },
            'a:visited': { 'color': theme('colors.indigo.900') },
            'ul > li::marker': {
              color: theme('colors.gray.500'),
            },
            'code::before': {
              content: 'none', // remove default backtick ` psuedo-element
            },
            'code::after': {
              content: 'none', // remove default backtick ` psuedo-element
            },
            'code': {
              backgroundColor: theme('colors.gray.200'),
              borderWidth: theme('borderWidth.DEFAULT'), 
              borderColor: theme('colors.gray.300'),
              borderStyle: theme('borderStyle.solid'),
              paddingTop: theme('padding.0'),
              paddingBottom: theme('padding.0'),
              paddingLeft: theme('padding.1'),
              paddingRight: theme('padding.1'),
              borderRadius: theme('borderRadius.DEFAULT'),
              // TODO: Figure out how to get this to work
              // fontFamily: theme('fontFamily.markipediaMono'),
              // fontFamily: ['Fira Code', 'monospace'],
              // fontFamily: ['monospace'],
            },
            'pre': {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.gray.900'),
              borderWidth: theme('borderWidth.DEFAULT'),
              borderColor: theme('colors.gray.200'),
              borderStyle: theme('borderStyle.solid'),
            },
            'blockquote': {
              fontStyle: 'italic',
              fontFamily: ['Linux Libertine', 'Georgia', 'Times', 'serif'],
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.gray.900'),
              borderWidth: theme('borderWidth.DEFAULT'),
              borderColor: theme('colors.gray.200'),
              borderStyle: theme('borderStyle.solid'),
            },
          },
        }
      }),
    },
  },
};