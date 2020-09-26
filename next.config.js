const withImages = require('next-images');
const withPrefresh = require('@prefresh/next');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withOffline = require('next-offline');

const { createLoader } = require('simple-functional-loader');
const rehypePrism = require('@mapbox/rehype-prism');
const visit = require('unist-util-visit');

const { flowRight } = require('./utils/flow.js');

// needed to map token to tailwind classes
const tokenClassNames = {
  tag: 'text-code-red',
  'attr-name': 'text-code-yellow',
  'attr-value': 'text-code-green',
  deleted: 'text-code-red',
  inserted: 'text-code-green',
  punctuation: 'text-code-white',
  'template-punctuation': 'text-code-green',
  keyword: 'text-code-purple',
  string: 'text-code-green',
  'template-string': 'text-code-green',
  function: 'text-code-blue',
  boolean: 'text-code-red',
  comment: 'text-gray-400 italic',
  property: 'text-code-teal',
  'property-access': 'text-code-teal',
  dom: 'text-code-blue',
  'method': 'text-code-teal',
  class: 'text-code-yellow',
  color: 'text-code-purple',
};

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
    // Move Preact into the framework chunk instead of duplicating in routes:
    const splitChunks = config.optimization && config.optimization.splitChunks;
    if (splitChunks) {
      const cacheGroups = splitChunks.cacheGroups;
      const test = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
      if (cacheGroups.framework) {
        cacheGroups.preact = Object.assign({}, cacheGroups.framework, { test });
        // if you want to merge the 2 small commons+framework chunks:
        // cacheGroups.commons.name = 'framework';
      }
    }

    if (options.isServer) {
      // mark `preact` stuffs as external for server bundle to prevent duplicate copies of preact
      config.externals.push(
        /^(preact|preact-render-to-string|preact-context-provider)([\\/]|$)/,
      );
    }

    // Install webpack aliases:
    const aliases = config.resolve.alias || (config.resolve.alias = {});
    aliases.react = aliases['react-dom'] = 'preact/compat';

    // Automatically inject Preact DevTools:
    if (options.dev && !options.isServer) {
      const entry = config.entry;
      config.entry = () =>
        entry().then((entries) => {
          entries['main.js'] = ['preact/debug'].concat(
            entries['main.js'] || [],
          );
          return entries;
        });
    }

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
            rehypePrism,
            () => {
              return (tree) => {
                visit(tree, 'element', (node, index, parent) => {
                  const [token, type] = node.properties.className || [];

                  console.log({ token, type, children: JSON.stringify(node.children.map(({ value }) => value).join(' | '), null, 2) });

                  if (token === 'token') {
                    node.properties.className = [tokenClassNames[type]];

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
            ...mdx,
            createLoader(function(src) {
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
            createLoader(function(src) {
              // we add getStaticProps function to get the post contents for each posts
              const content = [
                'import Post from "@/components/Blog/Post/Post"',
                'export { getStaticProps } from "@/blog/getStaticProps"',
                src,
                'export default (props) => <Post meta={meta} {...props} />',
              ].join('\n');

              if (content.includes('<!--more-->')) {
                return this.callback(
                  null,
                  content.split('<!--more-->').join('\n'),
                );
              }

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

module.exports = flowRight(withPrefresh, withImages, withOffline, withBundleAnalyzer)(conf);
