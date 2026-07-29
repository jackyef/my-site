// This module should only be used on the server-side
// @ts-nocheck
import rehypePrism from '@mapbox/rehype-prism';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import visit from 'unist-util-visit';
import hast from 'hastscript';

import { prismTokenMap } from '@/lib/prismTokenMap';

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
          node.properties.className = [prismTokenMap[type]];
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
