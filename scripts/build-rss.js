import fs from 'fs';
import RSS from 'rss';
import getAllPostPreviews from '../src/blog/getAllPostPreviews';
import { getAllToolsPages } from '../src/blog/getAllToolsPages';

const feed = new RSS({
  title: 'jackyef.com',
  site_url: 'https://jackyef.com',
  feed_url: 'https://jackyef.com/feed.xml',
});

getAllPostPreviews().forEach(({ link, module: { meta } }) => {
  feed.item({
    title: meta.title,
    guid: link,
    url: `https://jackyef.com${link}`,
    date: meta.date,
    description: meta.description,
    custom_elements: [].concat(
      meta.authors.map((author) => ({ author: [{ name: author.name }] })),
    ),
  });
});

getAllToolsPages().forEach(({ link, module: { meta } }) => {
  feed.item({
    title: meta.title,
    guid: link,
    url: `https://jackyef.com${link}`,
    date: meta.date,
    description: meta.description,
  });
});

fs.writeFileSync('./.next/static/feed.xml', feed.xml({ indent: true }));
