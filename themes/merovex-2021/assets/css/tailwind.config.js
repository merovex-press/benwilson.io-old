module.exports = {
  // mode: 'jit',
  darkMode: 'media', // or 'media' or 'class'
  variants: {
    extend: {
      typography: ['dark'],
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    // require('@tailwindcss/forms')
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'background': 'none',
            color: theme('colors.black'),
            a: {
              color: theme('colors.blue.500'),
              '&:visited': {
                color: theme('colors.violet.500'),
              },
            },
            'p+p': {
              'text-indent': '2ch'
            },
          },
        },
        dark: {
          css: {
            // color: theme('colors.red.200'),
            a: {
              color: theme('colors.blue.200'),
              '&:hover': {
                color: theme('colors.blue.100'),
              },
            },
            p: {
              color: theme('colors.red.500')
            },
            'p+p': {
              'text-indent': '6ch'
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.50'),
              'font-weight': 'semibold'
            },
            '&:visited': {
              color: theme('colors.violet.200'),
            },
          },
        }
      }),
    },
    fontFamily: {
      'sans': ["MerovexSans", '-apple-system', 'system-ui', "Segoe UI", 'Roboto', 'Lato', 'Helvetica', 'Arial', 'sans-serif'],
      'serif': ["MerovexSerif", 'Cambria', 'Georgia', "Times New Roman", 'Times', 'serif'],
      'display': ['IMFellEnglish', "MerovexSerif", 'Cambria', 'Georgia', "Times New Roman", 'Times', 'serif']
    },
    colors: { // https://tailwindpalette.jurs.me/
      'alternate': {
        '50': '#8eb3d2',
        '100': '#799cba',
        '200': '#6385a1',
        '300': '#4e6e89',
        '400': '#385770',
        '500': '#234058',
        '600': '#1a3042',
        '700': '#12202c',
        '800': '#091016',
        '900': '#000000',
      },
      brand: {
        '50': '#FFBE54',
        '100': '#e2bf88',
        '200': '#d1aa6b',
        '300': '#c0944f',
        '400': '#af7f32',
        '500': '#9e6915',
        '600': '#774f10',
        '700': '#4f350b',
        '800': '#281a05',
        '900': '#000000',
      },
      'secondary': {
        '50': '#e7e2de',
        '100': '#d3cbc4',
        '200': '#bfb4ab',
        '300': '#aa9d91',
        '400': '#968678',
        '500': '#826f5e',
        '600': '#68594b',
        '700': '#4e4339',
        '800': '#342d26',
        '900': '#1a1713',
      },
      'ternary': {
        '50': '#ffffff',
        '100': '#f4f1ed',
        '200': '#e9e4da',
        '300': '#ded6c8',
        '400': '#d3c9b5',
        '500': '#c8bba3',
        '600': '#b3a58c',
        '700': '#9e8f74',
        '800': '#88795d',
        '900': '#736345',
      },
      red: {
        '50': '#e0a8ab',
        '100': '#cb8f92',
        '200': '#b67679',
        '300': '#a25d60',
        '400': '#8d4447',
        '500': '#782b2e',
        '600': '#5a2023',
        '700': '#3c1617',
        '800': '#1e0b0c',
        '900': '#000000',
      },
      'orange': {
        '50': '#fcf8f5',
        '100': '#fcf1e9',
        '200': '#f9ddcd',
        '300': '#f7be9f',
        '400': '#f68f60',
        '500': '#f66434',
        '600': '#ea4121',
        '700': '#c63121',
        '800': '#9a2722',
        '900': '#79201f',
      },
      yellow: {
        '50': '#ffffff',
        '100': '#fbedd7',
        '200': '#f7dcaf',
        '300': '#f3ca87',
        '400': '#efb95f',
        '500': '#eba737',
        '600': '#ca8e2c',
        '700': '#a87521',
        '800': '#875c15',
        '900': '#65430a',
      },
      green: {
        '50': '#a8e0c2',
        '100': '#8fcbab',
        '200': '#76b694',
        '300': '#5da27d',
        '400': '#448d66',
        '500': '#2b784f',
        '600': '#205a3b',
        '700': '#163c28',
        '800': '#0b1e14',
        '900': '#000000',
      },
      blue: {
        '50': '#8dc7fb',
        '100': '#72b0e8',
        '200': '#579ad6',
        '300': '#3b83c3',
        '400': '#206db1',
        '500': '#05569e',
        '600': '#044177',
        '700': '#032b4f',
        '800': '#011628',
        '900': '#000000',
      },
      sky: {
        '50': '#ffffff',
        '100': '#d7eafb',
        '200': '#afd5f7',
        '300': '#86bff3',
        '400': '#5eaaef',
        '500': '#3695eb',
        '600': '#2b7ec9',
        '700': '#2067a8',
        '800': '#155086',
        '900': '#0a3964',
      },
      indigo: {
        '50': '#a8abe0',
        '100': '#8f92cb',
        '200': '#7679b6',
        '300': '#5d60a2',
        '400': '#44478d',
        '500': '#2b2e78',
        '600': '#20235a',
        '700': '#16173c',
        '800': '#0b0c1e',
        '900': '#000000',
      },
      violet: {
        '50': '#dfa8e0',
        '100': '#ca8fcb',
        '200': '#b576b6',
        '300': '#a05da2',
        '400': '#8b448d',
        '500': '#762b78',
        '600': '#59205a',
        '700': '#3b163c',
        '800': '#1e0b1e',
        '900': '#000000',
      },
      'gray': {
        '50': '#d0cdc9',
        '100': '#bab6b1',
        '200': '#a39f9a',
        '300': '#8d8982',
        '400': '#76726b',
        '500': '#605b53',
        '600': '#48443e',
        '700': '#302e2a',
        '800': '#181715',
        '900': '#000000',
      },
      'white': {
        'DEFAULT': '#eff0ef'
      },
      'bone-white': {
        'DEFAULT': '#FFFFFF'
      },
      'black': {
        'DEFAULT': '#222523'
      }
    }
  }
}