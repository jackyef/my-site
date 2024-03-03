const { StatsWriterPlugin } = require('webpack-stats-plugin');
const { RelativeCiAgentWebpackPlugin } = require('@relative-ci/agent');
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
  webpack: function (config, options) {
    const { dev, isServer } = options;

    if (!dev && !isServer) {
      config.plugins.push(
        new RelativeCiAgentWebpackPlugin({
          stats: { excludeAssets: [/stats.json/] },
        }),
      );
      config.plugins.push(
        new StatsWriterPlugin({
          filename: 'stats.json',
          stats: {
            context: './', // optional, will improve readability of the paths
            assets: true,
            entrypoints: true,
            chunks: true,
            modules: true,
          },
        }),
      );
    }

    return config;
  },
};

module.exports = flowRight(withBundleAnalyzer)(conf);
