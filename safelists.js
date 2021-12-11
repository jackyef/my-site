// List of classes we want to be included in our final CSS bundle
// Even though tailwind can't find usage of them
// Ref: https://github.com/tailwindlabs/tailwindcss-jit/issues/32
module.exports = [
  '::-webkit-scrollbar-thumb',
  '::-webkit-scrollbar-track',
  'hash-link',
  'page-outline',
  'toc-level-1',
  '2xl:block',
];
