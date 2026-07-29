/**
 * Prism token type → Tailwind class, built on the `--code-*` tokens so code
 * re-tints with the theme instead of staying dark on a light page.
 *
 * The single source for every place this site colours code: the MDX rehype
 * plugin that highlights blog posts at build time, the Claymorphism tool, and
 * the usage snippets on /design. Two copies of this map used to exist and had
 * already drifted — one still coloured comments `text-gray-400`, which does not
 * move with the theme.
 */
export const prismTokenMap = {
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
  number: 'text-code-purple',
  comment: 'text-code-comment italic',
  property: 'text-code-teal',
  'property-access': 'text-code-teal',
  dom: 'text-code-blue',
  method: 'text-code-teal',
  class: 'text-code-yellow',
  'class-name': 'text-code-yellow',
  selector: 'text-code-yellow',
  color: 'text-code-purple',
  'function-variable': 'text-code-blue',
  variable: 'text-code-blue',
  'interpolation-punctuation': 'text-code-teal',
  interpolation: 'text-code-red',
  operator: 'text-code-yellow',
};

export type PrismTokenType = keyof typeof prismTokenMap;
