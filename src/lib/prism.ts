/**
 * Prism, configured for highlighting strings at runtime.
 *
 * Blog code blocks are highlighted at build time by the MDX rehype plugin, so
 * this exists for the places that colour a string in the browser: the
 * Claymorphism output and the usage snippets on /design.
 *
 * Two ordering constraints make this file look the way it does, and both are
 * why everything here uses `require` rather than `import` — ESM imports hoist,
 * which would run them before the assignments below.
 *
 * 1. Prism auto-highlights. On load it walks the document for
 *    `code[class*="language-"]` and rewrites their innards, which shreds any
 *    React-rendered output inside such an element. It reads the opt-out once,
 *    while core is evaluating, off a global that has to already be there
 *    (`manual: _self.Prism && _self.Prism.manual` — prism.js line 53), so
 *    setting `Prism.manual` after importing is too late. Seed a stub first.
 *
 * 2. The grammar files under `prismjs/components` are UMD-style: they close
 *    over a free `Prism` variable and expect the global. Core assigns itself
 *    there, so they must be required after it, and in dependency order.
 *    Core already ships markup, css, clike and javascript.
 */
// Cast through unknown: @types/prismjs already declares a global `Prism` as the
// full namespace, and the stub is deliberately only the one flag core reads.
(globalThis as unknown as { Prism?: { manual?: boolean } }).Prism = {
  manual: true,
};

const Prism: typeof import('prismjs') = require('prismjs');

require('prismjs/components/prism-typescript');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-tsx');

/** Languages the snippet renderer knows how to colour. */
export type SnippetLanguage = 'tsx' | 'css';

export { Prism };
