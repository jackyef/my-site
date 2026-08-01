const { StatsWriterPlugin } = require('webpack-stats-plugin');
// The CJS build used to be `{ default: fn }` and is a bare `fn` as of 4.22 —
// accept either so a bump either way doesn't fail the build inside a webpack
// hook, where the error surfaces as an opaque `is not a function`.
const filterWebpackStatsModule = require('@bundle-stats/plugin-webpack-filter');
const filterWebpackStats =
  filterWebpackStatsModule.default ?? filterWebpackStatsModule;
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { flowRight } = require('./utils/flow.js');

/**
 * @type {import('next').NextConfig}
 */
const conf = {
  turbopack: {},
  pageExtensions: ['ts', 'tsx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // `/tools/*` and `/absurd-ui/*` were separate top-level sections before the
  // experiments they held moved under `/experiments`. Nothing in the site links
  // to the old paths any more, but they have been public for years — these keep
  // the inbound links and search results alive.
  async redirects() {
    return [
      {
        source: '/tools/playground',
        destination: '/experiments/playground',
        permanent: true,
      },
      {
        source: '/tools/claymorphism',
        destination: '/experiments/claymorphism',
        permanent: true,
      },
      {
        source: '/tools/speech-to-text',
        destination: '/experiments/speech-to-text',
        permanent: true,
      },
      {
        source: '/absurd-ui',
        destination: '/experiments',
        permanent: true,
      },
      {
        source: '/absurd-ui/ballistic-slider',
        destination: '/experiments/ballistic-slider',
        permanent: true,
      },
      // The design tokens page it replaced.
      {
        source: '/about/tokens',
        destination: '/design',
        permanent: true,
      },
    ];
  },
  webpack: (config, options) => {
    const { dev, isServer } = options;

    // Output webpack stats JSON file only for
    // client-side/production build
    if (!dev && !isServer) {
      config.plugins.push(
        new StatsWriterPlugin({
          filename: '../webpack-stats.json',
          stats: {
            assets: true,
            chunks: true,
            modules: true,
          },
          transform: (webpackStats) => {
            const filteredSource = filterWebpackStats(webpackStats);
            return JSON.stringify(filteredSource);
          },
        }),
      );
    }

    return config;
  },
};

module.exports = flowRight(withBundleAnalyzer)(conf);
