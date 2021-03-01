/**
 * Helpful references to read when working with sitemaps
 *
 * - https://www.sitemaps.org/protocol.html
 * - https://support.google.com/webmasters/answer/183668?hl=en
 */

const path = require('path');
const fs = require('fs');
const globby = require('globby');
const xmlFormat = require('xml-formatter');

async function generateSiteMap() {
  const pages = await globby([
    'src/pages/**/*.tsx',
    'src/pages/posts/**/*.mdx',
    '!src/pages/_*.tsx',
    '!src/pages/**/[id].tsx',
    '!src/pages/api',
  ]);

  const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .filter(page => !page.includes('404'))
          .map((page) => {
            const path = page
              .replace('src/pages', '')
              .replace('.tsx', '')
              .replace('.mdx', '');

            // remove leading `/` and trailing `/index`
            // and change `/index` to just ''
            const route =
              path === '/index'
                ? ''
                : path.replace(/^\//, '').replace(/\/index$/, '');

            return `
                  <url>
                    <loc>${`https://jackyef.com/${route}`}</loc>
                  </url>`;
          })
          .join('')}
      </urlset>
  `;

  fs.writeFileSync(
    path.resolve(__dirname, '../.next/static/sitemap.xml'),
    xmlFormat(sitemap),
  );
}

generateSiteMap();
