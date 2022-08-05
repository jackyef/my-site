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

  // Surface and shadow classes
  'bg-surface-0',
  'bg-surface-1',
  'bg-surface-2',
  'bg-surface-3',
  'bg-surface-4',
  'bg-surface-5',
  'shadow-surface-0',
  'shadow-surface-1',
  'shadow-surface-2',
  'shadow-surface-3',
  'shadow-surface-4',
  'shadow-surface-5',
];
