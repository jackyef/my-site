/**
 * Helpful references to read when working with sitemaps
 *
 * - https://www.sitemaps.org/protocol.html
 * - https://support.google.com/webmasters/answer/183668?hl=en
 */

const path = require('path');
const fs = require('fs');

const RSS = require('rss');
const globby = require('globby');
const xmlFormat = require('xml-formatter');

const getTitleInFrontMatter = (mdxContent) => {
  const firstDelimiter = mdxContent.indexOf('---');
  const secondDelimiter = mdxContent.indexOf('---', firstDelimiter + 1);

  const frontmatterContent = mdxContent.slice(
    firstDelimiter + 3,
    secondDelimiter,
  );

  const title = frontmatterContent.match(/title:( |\s)(.*?)description:/ms)[2];

  return title.trim().replace(/(\r\n|\r|\n) /g, '');
};

const getDescriptionInFrontMatter = (mdxContent) => {
  const firstDelimiter = mdxContent.indexOf('---');
  const secondDelimiter = mdxContent.indexOf('---', firstDelimiter + 1);

  const frontmatterContent = mdxContent.slice(
    firstDelimiter + 3,
    secondDelimiter,
  );

  const description = frontmatterContent.match(
    /description:( |\s)(.*?)date:/ms,
  )[2];

  return description.trim().replace(/(\r\n|\r|\n) /g, '');
};

const getDateInFrontMatter = (mdxContent) => {
  const firstDelimiter = mdxContent.indexOf('---');
  const secondDelimiter = mdxContent.indexOf('---', firstDelimiter + 1);

  const frontmatterContent = mdxContent.slice(
    firstDelimiter + 3,
    secondDelimiter,
  );

  const date = frontmatterContent.match(/date: \'(.*)\'/)?.[1];

  return date;
};

async function generateRSSFeed() {
  const feed = new RSS({
    title: 'jackyef.com',
    site_url: 'https://jackyef.com',
    feed_url: 'https://jackyef.com/feed.xml',
  });
  const posts = await globby(['src/pages/posts/**/index.mdx']);
  let contents = posts.map((post, index) => {
    const content = fs.readFileSync(post, 'utf-8');

    return {
      postIndex: index,
      content,
    };
  });

  contents = contents.sort((a, b) => {
    const aDate = new Date(getDateInFrontMatter(a.content));
    const bDate = new Date(getDateInFrontMatter(b.content));

    return bDate.getTime() - aDate.getTime();
  });

  contents.forEach(({ content, postIndex }) => {
    const path = posts[postIndex]
      .replace('src/pages', '')
      .replace('/index.mdx', '');

    feed.item({
      title: getTitleInFrontMatter(content),
      guid: path,
      url: `https://jackyef.com${path}`,
      date: getDateInFrontMatter(content),
      description: getDescriptionInFrontMatter(content),
      custom_elements: [{ author: [{ name: 'Jacky Efendi' }] }],
    });
  });

  fs.writeFileSync('./.next/static/feed.xml', feed.xml({ indent: true }));
}

async function generateSiteMap() {
  const pages = await globby([
    'src/pages/**/*.tsx',
    '!src/pages/_*.tsx',
    '!src/pages/**/[id].tsx',
    '!src/pages/api',
  ]);

  const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .filter((page) => !page.includes('404'))
          .map((page) => {
            const path = page.replace('src/pages', '').replace('.tsx', '');

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
generateRSSFeed();
