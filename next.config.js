const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withOffline = require('next-offline');

const { flowRight } = require('./utils/flow.js');
const configureMDX = require('./utils/configs/configureMDX.js');

/**
 * @type {import('next').NextConfig}
 */
const conf = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  workboxOpts: {
    swDest: 'static/service-worker.js',
    exclude: [
      /middleware-manifest\.js/,

      // These files don't exist with Next, even though react-loadable is used under the hood
      // we don't care about precaching them
      /build-manifest\.js/,
      /react-loadable-manifest\.js/,
    ],

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

    // https://github.com/vercel/next.js/issues/36896#issuecomment-1126202598
    if (!options.dev && options.isServer && options.nextRuntime === 'nodejs') {
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

module.exports = flowRight(
  // Disabling this for now since it seems to interfere with partytown
  // withOffline,
  withBundleAnalyzer,
)(conf);
