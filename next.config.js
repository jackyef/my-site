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
};

module.exports = flowRight(withBundleAnalyzer)(conf);
