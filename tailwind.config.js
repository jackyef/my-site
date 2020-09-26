const defaultTheme = require('tailwindcss/defaultTheme');
const mdx = require('@mdx-js/mdx')

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    mode: 'all',
    content: [
      // The wild card here is needed because vercel rename our next.config.js file for some of their experimental features
      // 16:27:51.948  	-rw-r--r--   1 root root    908 Sep 26 09:27 next.config.js
      // 16:27:51.948  	-rw-r--r--   1 root root   6595 Sep 26 09:27 next.config.original.1601112471648.js
      // https://vercel.com/jackyef/jackyef/ekvzdkthq
      // https://github.com/tailwindlabs/blog.tailwindcss.com/issues/13#issuecomment-699470309
      './next.config.js',
      './code-highlighter-token.js',
      './src/**/*.{ts,tsx,js,jsx,mdx}',
    ],
    options: {
      extractors: [
        {
          extensions: ['mdx'],
          extractor: (content) => {
            content = mdx.sync(content)

            // Capture as liberally as possible, including things like `h-(screen-1.5)`
            const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

            // Capture classes within other delimiters like .block(class="w-1/2") in Pug
            const innerMatches =
              content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) || []

            return broadMatches.concat(innerMatches)
          },
        },
      ],
    },
  },
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        'halfFadeIn': {
          '0%': {
            opacity: 0.5,
          },
          '100%': {
            opacity: 1,
          },
        },
        'flyInTop': {
          '0%': {
            transform: 'translateY(-10px)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        'halfFadeIn': 'halfFadeIn 0.3s ease-in-out',
        'flyInTop': 'flyInTop 0.3s ease-in-out',
      },
      spacing: {
        '9/16': '56.25%',
      },
      textShadow: {
        // defaults to {}
        default: '0 2px 5px rgba(0, 0, 0, 0.5)',
        lg: '0 2px 10px rgba(0, 0, 0, 0.5)',
      },
      lineHeight: {
        '11': '2.75rem',
        '12': '3rem',
        '13': '3.25rem',
        '14': '3.5rem',
      },
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
      },
      colors: {
        code: {
          green: '#b5f4a5',
          yellow: '#ffe484',
          purple: '#d9a9ff',
          red: '#ff8383',
          blue: '#93ddfd',
          white: '#fff',
          teal: '#7fdbca',
        },
        white: 'var(--color-white)',
      },
      typography: (theme) => ({
        default: {
          css: {
            color: theme('colors.gray.900'),
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.gray.900'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.900'),
            },
            'ol li:before': {
              color: theme('colors.gray.500'),
            },
            'ul li:before': {
              backgroundColor: theme('colors.gray.400'),
            },
            code: {
              color: theme('colors.gray.900'),
            },
            a: {
              color: theme('colors.teal.600'),
              '&:hover': {
                color: theme('colors.teal.400'),
              },
            },
            pre: {
              color: theme('colors.gray.200'),
              backgroundColor: theme('colors.gray.900'),
            },
            blockquote: {
              quotes: 'none',
              color: theme('colors.gray.900'),
              borderLeftColor: theme('colors.gray.200'),
            },
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
    require('@tailwindcss/typography'),
    require('tailwindcss-typography')({
      // all these options default to the values specified here
      ellipsis: true, // whether to generate ellipsis utilities
      hyphens: true, // whether to generate hyphenation utilities
      kerning: true, // whether to generate kerning utilities
      textUnset: true, // whether to generate utilities to unset text properties
      componentPrefix: 'c-', // the prefix to use for text style classes
    }),
  ],
};
