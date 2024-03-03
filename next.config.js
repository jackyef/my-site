const { StatsWriterPlugin } = require('webpack-stats-plugin');
const filterWebpackStats =
  require('@bundle-stats/plugin-webpack-filter').default;
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
