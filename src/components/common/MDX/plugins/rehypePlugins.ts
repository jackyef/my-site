// This module should only be used on the server-side
// @ts-nocheck
import rehypePrism from '@mapbox/rehype-prism';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
// import rehypeToc from '@jsdevtools/rehype-toc';
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
  comment: 'text-gray-400 italic',
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
  // [
  //   rehypeToc,
  //   {
  //     headings: ['h1', 'h2', 'h3'], // Include only h1-h3 in the TOC
  //     customizeTOC: (toc) => {
  //       toc.properties['aria-label'] = 'Table of content';

  //       toc.children[0].properties.className +=
  //         ' bg-surface-3 shadow-surface-3';

  //       return toc;
  //     },
  //     cssClasses: {
  //       toc: 'page-outline hidden 2xl:block', // Change the CSS class for the TOC
  //       link: 'page-link', // Change the CSS class for links in the TOC
  //     },
  //   },
  // ],
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
      visit(tree, 'element', (node, index, parent) => {
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
