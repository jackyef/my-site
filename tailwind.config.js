const defaultTheme = require('tailwindcss/defaultTheme');
const mdx = require('@mdx-js/mdx');

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    mode: 'all',
    content: [
      /**
       * We need to extract the classnames used for mdx tokens to a separate `code-highlighter-token.js` file
       * Previously, we put it in the `next.config.js` file, but the token got purged.
       * It was caused by vercel renaming our original next.config.js file during build.
       *
       * Log from debugging:
       * 16:27:51.948  	-rw-r--r--   1 root root    908 Sep 26 09:27 next.config.js
       * 16:27:51.948  	-rw-r--r--   1 root root   6595 Sep 26 09:27 next.config.original.1601112471648.js
       * https://vercel.com/jackyef/jackyef/ekvzdkthq
       * https://github.com/tailwindlabs/blog.tailwindcss.com/issues/13#issuecomment-699470309
       */
      './next.config.js',
      './code-highlighter-token.js',
      './src/**/*.{ts,tsx,js,jsx,mdx}',
    ],
    options: {
      whitelist: [
        '::-webkit-scrollbar-thumb',
        '::-webkit-scrollbar-track',
        'hash-link',
        'page-outline',
        'toc-level-1',
        'xl:block',
      ],
      extractors: [
        {
          extensions: ['mdx'],
          extractor: (content) => {
            content = mdx.sync(content);

            // Capture as liberally as possible, including things like `h-(screen-1.5)`
            const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

            // Capture classes within other delimiters like .block(class="w-1/2") in Pug
            const innerMatches =
              content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) ||
              [];

            return broadMatches.concat(innerMatches);
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
        halfFadeIn: {
          '0%': {
            opacity: 0.5,
          },
          '100%': {
            opacity: 1,
          },
        },
        flyInTop: {
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
        halfFadeIn: 'halfFadeIn 0.3s ease-in-out',
        flyInTop: 'flyInTop 0.3s ease-in-out',
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
      boxShadow: {
        md: 'var(--shadow-md)',
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
        theme: {
          text: 'var(--color-text)',
          heading: 'var(--color-heading)',
          subtitle: 'var(--color-subtitle)',
          link: 'var(--color-link)',
          background: 'var(--color-bg)',
          backgroundOffset: 'var(--color-bg-offset)',
        },
      },
      typography: (theme) => ({
        default: {
          css: {
            color: theme('colors.theme.text'),
            h2: {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.theme.text'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.theme.text'),
            },
            'ol li:before': {
              color: theme('colors.theme.subtitle'),
            },
            'ul li:before': {
              backgroundColor: theme('colors.theme.subtitle'),
            },
            code: {
              color: theme('colors.theme.text'),
            },
            strong: {
              color: theme('colors.theme.text'),
            },
            a: {
              color: theme('colors.theme.link'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.theme.text'),
              },
            },
            pre: {
              color: theme('colors.gray.200'),
              backgroundColor: theme('colors.gray.900'),
            },
            blockquote: {
              quotes: 'none',
              color: theme('colors.theme.text'),
              borderLeftColor: theme('colors.theme.subtitle'),
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
