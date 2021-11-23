// const withPreact = require('next-plugin-preact');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withOffline = require('next-offline');

const { flowRight } = require('./utils/flow.js');
const configureMDX = require('./utils/configs/configureMDX.js');

const conf = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: { modern: true }, // enable experimental module/nomodule optimisation
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  workboxOpts: {
    swDest: 'static/service-worker.js',
    exclude: [/middleware-manifest.json/],

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
    configureMDX(config, options);

    if (!options.dev && options.isServer) {
      const originalEntry = config.entry;

      config.entry = async () => {
        const entries = { ...(await originalEntry()) };

        // we want to build this script as well, and run it on build to generate feed.xml file
        entries['scripts/build-rss'] = './scripts/build-rss.js';

        return entries;
      };
    }

    return config;
  },
};

module.exports = flowRight(withOffline, withBundleAnalyzer)(conf);
