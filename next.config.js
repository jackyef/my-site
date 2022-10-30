const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { flowRight } = require('./utils/flow.js');

/**
 * @type {import('next').NextConfig}
 */
const conf = {
  pageExtensions: ['ts', 'tsx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // webpack(config, options) {
  //   // https://github.com/vercel/next.js/issues/36896#issuecomment-1126202598
  //   if (!options.dev && options.isServer && options.nextRuntime === 'nodejs') {
  //     const originalEntry = config.entry;

  //     config.entry = async () => {
  //       const entries = { ...(await originalEntry()) };

  //       // we want to build this script as well, and run it on build to generate feed.xml file
  //       entries['scripts/build-rss'] = './scripts/build-rss.js';

  //       return entries;
  //     };
  //   }

  //   return config;
  // },
};

module.exports = flowRight(withBundleAnalyzer)(conf);
