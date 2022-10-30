const fs = require('fs');
const path = require('path');

const postDir = path.resolve(__dirname, '../src/pages/posts');
const postSlugs = fs.readdirSync(postDir);

/**
 * @type {import('../types/types').PageData[])}
 */
const pagesData = postSlugs.map((slug) => {
  const fileContent = fs.readFileSync(
    path.resolve(postDir, slug, 'index.mdx'),
    'utf-8',
  );

  const postMeta = {
    title: fileContent
      .match(/title:( |\s)(.*?)description:/ms)[2]
      .trim()
      .replace(/(\r\n|\r|\n) /g, ''),
    description: fileContent
      .match(/description:( |\s)(.*?)date:/ms)[2]
      .trim()
      .replace(/(\r\n|\r|\n) /g, ''),
    link: `/posts/${slug}`,
  };

  return postMeta;
});

fs.writeFileSync(
  path.resolve(__dirname, '../src/utils/pageSearch/_files/pages-data.json'),
  JSON.stringify(pagesData, null, 2),
);
