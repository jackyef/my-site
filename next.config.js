const withPreact = require('next-plugin-preact');
const withImages = require('next-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withOffline = require('next-offline');

const { createLoader } = require('simple-functional-loader');
const rehypePrism = require('@mapbox/rehype-prism');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const rehypeSlug = require('rehype-slug');
const rehypeToc = require('@jsdevtools/rehype-toc');
const visit = require('unist-util-visit');
const hast = require('hastscript');

const tokenClassNames = require('./code-highlighter-token.js');
const { flowRight } = require('./utils/flow.js');

const conf = {
  target: 'serverless',
  pageExtensions: ['ts', 'tsx', 'mdx'],

  experimental: { modern: true }, // enable experimental module/nomodule optimisation

  workboxOpts: {
    swDest: 'static/service-worker.js',

    runtimeCaching: [
      {
        urlPattern: /.(png|jpg|jpeg|webp|svg)$/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /api/,
        handler: 'NetworkFirst',
        options: {
          cacheableResponse: {
            statuses: [0, 200],
            headers: {
              'x-test': 'true',
            },
          },
        },
      },
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {
            maxEntries: 200,
          },
        },
      },
    ],
  },

  webpack(config, options) {
    /**
     * Start of MDX stuffs
     * https://github.com/tailwindlabs/blog.tailwindcss.com/blob/master/next.config.js
     */

    const mdx = [
      options.defaultLoaders.babel,
      {
        loader: '@mdx-js/loader',
        options: {
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeToc,
              {
                headings: ['h1', 'h2', 'h3'], // Include only h1-h3 in the TOC
                cssClasses: {
                  toc: 'page-outline hidden xl:block', // Change the CSS class for the TOC
                  link: 'page-link', // Change the CSS class for links in the TOC
                },
              },
            ],
            [
              rehypeAutolinkHeadings,
              {
                behavior: 'append',
                properties: {
                  ariaHidden: true,
                  tabIndex: -1,
                  class: 'hash-link fancy-anchor',
                },
                content: hast('span', '🔗'),
              },
            ],
            rehypePrism,
            () => {
              return (tree) => {
                visit(tree, 'element', (node, index, parent) => {
                  const [token, type] = node.properties.className || [];

                  if (token === 'token') {
                    node.properties.className = [tokenClassNames[type]];
                  }

                  if (node.tagName === 'a') {
                    node.properties.className = ['fancy-anchor'];
                  }

                  if (node.tagName === 'hr') {
                    node.properties.className = [
                      'mx-6',
                      'xl:mx-12',
                      'border-gray-400',
                      'opacity-50',
                      'my-4',
                    ];
                  }
                });
              };
            },
          ],
        },
      },
    ];

    config.module.rules.push({
      test: /\.mdx$/,
      oneOf: [
        {
          resourceQuery: /preview/,
          use: [
            mdx[0],
            {
              ...mdx[1],
              options: {
                ...mdx[1].options,
                rehypePlugins: [
                  ...mdx[1].options.rehypePlugins.filter(
                    (v) => v[0] !== rehypeToc,
                  ), // do not generate ToC for post previews
                ],
              },
            },
            createLoader(function (src) {
              // this part will cut down the mdx content for previews, so we don't load too many content into
              // pages that are showing list of post previews
              if (src.includes('<!--more-->')) {
                const [preview] = src.split('<!--more-->');
                return this.callback(null, preview);
              }

              const [preview] = src.split('<!--/excerpt-->');
              return this.callback(null, preview.replace('<!--excerpt-->', ''));
            }),
          ],
        },
        {
          use: [
            ...mdx,
            createLoader(function (src) {
              const content = [
                'import { Flipped } from "react-flip-toolkit"',
                'import Post from "@/components/Blog/Post/Post"',

                // We add getStaticProps function to get the post contents for each posts
                'export { getStaticProps } from "@/blog/getStaticProps"',

                // We use <Flipped> here to add FLIP animation to the preview texts
                // on client-side navigation
                src.replace(
                  /<!--start-->(.*)<!--more-->(.*)/s,
                  [
                    '<Flipped flipId={`${meta.title}-excerpt`} spring="noWobble">',
                    '<div id={`${meta.title}-excerpt`}>$1</div>',
                    '</Flipped>',
                    '<div id="restOfArticle">',
                    '$2',
                    '</div>',
                  ].join('\n'),
                ),

                // This new line is needed
                '',

                'export default (props) => <Post meta={meta} {...props} />',
              ].join('\n');

              return this.callback(
                null,
                content.replace(/<!--excerpt-->.*<!--\/excerpt-->/s, ''),
              );
            }),
          ],
        },
      ],
    });

    if (!options.dev && options.isServer) {
      const originalEntry = config.entry;

      config.entry = async () => {
        const entries = { ...(await originalEntry()) };

        // we want to build this script as well, and run it on build to generate feed.xml file
        entries['./scripts/build-rss.js'] = './scripts/build-rss.js';

        return entries;
      };
    }

    return config;
  },
};

module.exports = flowRight(
  withPreact,
  withImages,
  withOffline,
  withBundleAnalyzer,
)(conf);
