// This module should only be used on the server-side
// @ts-nocheck
import rehypePrism from '@mapbox/rehype-prism';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import visit from 'unist-util-visit';
import hast from 'hastscript';

export const tokenClassNames = {
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
  comment: 'text-code-comment italic',
  property: 'text-code-teal',
  'property-access': 'text-code-teal',
  dom: 'text-code-blue',
  method: 'text-code-teal',
  class: 'text-code-yellow',
  color: 'text-code-purple',
  'function-variable': 'text-code-blue',
  variable: 'text-code-blue',
  'interpolation-punctuation': 'text-code-teal',
  interpolation: 'text-code-red',
};

export const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'prepend',
      properties: {
        ariaHidden: true,
        tabIndex: -1,
        class: 'hash-link',
      },
      content: hast('span', '#'),
    },
  ],
  rehypePrism,
  () => {
    return (tree) => {
      visit(tree, 'element', (node, _index, _parent) => {
        const [token, type] = node.properties.className || [];

        if (token === 'token') {
          node.properties.className = [tokenClassNames[type]];
        }

        if (node.tagName === 'hr') {
          node.properties.className = [
            'mx-6',
            'xl:mx-12',
            'border-gray-400',
            'opacity-50',
            'my-4',
          ];
        }
      });
    };
  },
];

export const rehypePluginsForPreview = rehypePlugins;
