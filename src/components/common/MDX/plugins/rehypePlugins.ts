// This module should only be used on the server-side
// @ts-nocheck
import rehypePrism from '@mapbox/rehype-prism';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

import { prismTokenMap } from '@/lib/prismTokenMap';

// Everything a heading contributes to the table of contents, read off the
// element rehype produced rather than off the markdown that produced it.
//
// This used to be a regex over the raw MDX source, which had the table
// carrying markdown it could not render — `[text](url)` and backticks showed
// up verbatim in the rail — and, worse, deriving its own slugs. Those slugs had
// to agree with rehype-slug's ids for the anchors to land, and they didn't:
// `## The [`CSSStyleSheet`](https://…) interface` became
// `#the-cssstylesheethttpsdevelopermozillaorgen-usdocswebapicssstylesheet-interface`
// against a real id of `the-cssstylesheet-interface`, so the link went nowhere
// and the heading had no entry. Reading node.properties.id makes the two the
// same value by construction rather than by agreement.
const headingText = (node) => {
  if (node.type === 'text') return node.value;
  // rehype-autolink-headings prepends a '#' anchor inside every heading; it is
  // decoration, not part of the title. It is configured with a raw `class`
  // property and passes it through without hast's property-name normalisation,
  // so the class lands under `class` as a string rather than `className` as an
  // array — check both rather than assuming which.
  const { class: cls, className } = node.properties || {};
  const classes = [cls, className].flat().filter(Boolean).join(' ');
  if (classes.split(/\s+/).includes('hash-link')) return '';
  return (node.children || []).map(headingText).join('');
};

export const collectHeadings = (into) => () => (tree) => {
  visit(tree, 'element', (node) => {
    // h2 and h3 only — h1 is the post title, and anything deeper is noise in a
    // rail this narrow.
    if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
    if (!node.properties?.id) return;

    into.push({
      level: Number(node.tagName.slice(1)),
      id: String(node.properties.id),
      text: headingText(node).trim(),
    });
  });
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
      content: h('span', '#'),
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
