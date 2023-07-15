import fs from 'fs';
import path from 'path';

import { serialize } from 'next-mdx-remote/serialize';

import {
  rehypePlugins,
  rehypePluginsForPreview,
} from '@/components/common/MDX/plugins/rehypePlugins';

import type { PostMeta, Post, PostHeading } from './types';

type Opts = {
  limit?: number;
  onlyPreview?: boolean;
  tags?: string[];
};

const getTitleInFrontMatter = (mdxContent: string) => {
  const firstDelimiter = mdxContent.indexOf('---');
  const secondDelimiter = mdxContent.indexOf('---', firstDelimiter + 1);

  const frontmatterContent = mdxContent.slice(
    firstDelimiter + 3,
    secondDelimiter,
  );

  const title = frontmatterContent.match(
    /title:( |\s)(.*?)description:/ms,
  )?.[1] as string;

  return title.trim();
};

const getDateInFrontMatter = (mdxContent: string) => {
  const firstDelimiter = mdxContent.indexOf('---');
  const secondDelimiter = mdxContent.indexOf('---', firstDelimiter + 1);

  const frontmatterContent = mdxContent.slice(
    firstDelimiter + 3,
    secondDelimiter,
  );

  const date = frontmatterContent.match(/date: \'(.*)\'/)?.[1] as string;

  return new Date(date);
};

const getTagsInFrontMatter = (mdxContent: string) => {
  const firstDelimiter = mdxContent.indexOf('---');
  const secondDelimiter = mdxContent.indexOf('---', firstDelimiter + 1);

  const frontmatterContent = mdxContent.slice(
    firstDelimiter + 3,
    secondDelimiter,
  );

  const tags = frontmatterContent.match(/tags: (.*)/)?.[1] as string;

  return JSON.parse(tags.replace(/'/g, '"')) as string[];
};

export const getMDXContent = (filePath: string, onlyPreview?: boolean) => {
  const mdxPath = path.join(filePath);
  let source = fs.readFileSync(mdxPath, 'utf8').toString();

  const title = getTitleInFrontMatter(source);

  if (!onlyPreview) {
    source = source.replace(
      /{\/\* \!start-of-preview \*\/}(.*){\/\* \!end-of-preview \*\/}(.*)/s,
      [
        `<Flipped flipId="${title}-excerpt" spring="noWobble">`,
        `<div id="${title}-excerpt">$1</div>`,
        '</Flipped>',
        '<div id="restOfArticle">',
        '$2',
        '</div>',
      ].join('\n'),
    );
  }

  return !onlyPreview
    ? source
    : source.slice(0, source.indexOf('{/* !end-of-preview */}'));
};

type MatchedHeading = {
  groups: {
    flag: string;
    content: string;
  };
};

const getHeadingsFromMDXContent = (mdxContent: string): PostHeading[] => {
  return Array.from(mdxContent.matchAll(/(?<flag>#{1,6})\s+(?<content>.+)/g))
    .map((match) => {
      const {
        groups: { flag, content },
      } = match as unknown as MatchedHeading;

      return {
        level: flag.length,
        content,
      };
    })
    .filter(({ level }) => level === 2 || level === 3);
};

export const getPostFromMDXContent = async (
  mdxContent: string,
  link: string,
  onlyPreview?: boolean,
) => {
  const mdxSource = await serialize(mdxContent, {
    parseFrontmatter: true,
    mdxOptions: {
      rehypePlugins: !onlyPreview ? rehypePlugins : rehypePluginsForPreview,
      format: 'mdx',
    },
  });

  const frontmatter = mdxSource.frontmatter as unknown as PostMeta;

  return {
    link,
    metadata: {
      date: frontmatter.date,
      description: frontmatter.description,
      tags: frontmatter.tags,
      ogImage: frontmatter.ogImage,
      title: frontmatter.title,
      readingTime: frontmatter.readingTime,
    },
    headings: getHeadingsFromMDXContent(mdxContent),
    mdxSource,
  };
};

export const getPost = async (filePath: string) => {
  const mdxContent = getMDXContent(filePath);
  const rootPathStart = filePath.indexOf('src/pages');
  const link = filePath
    .replace('/index.mdx', '')
    .replace(/\.mdx$/, '')
    .substring(rootPathStart + 'src/pages'.length);

  return getPostFromMDXContent(mdxContent, link);
};

export const getPostBySlug = async (slug: string) => {
  const filePath = path.join(
    process.cwd(),
    'src/pages/posts',
    `${slug}`,
    'index.mdx',
  );

  return getPost(filePath);
};

export const getPosts = async ({
  limit,
  onlyPreview = false,
  tags = [],
}: Opts = {}): Promise<Post[]> => {
  const slugs = fs.readdirSync(path.join(process.cwd(), './src/pages/posts'));

  let mdxContents = slugs.map((slug, i) => {
    const mdxPath = path.join(
      process.cwd(),
      './src/pages/posts',
      slug,
      'index.mdx',
    );

    return {
      slugIndex: i,
      content: getMDXContent(mdxPath, onlyPreview),
    };
  });

  mdxContents = mdxContents.sort((a, b) => {
    const aDate = getDateInFrontMatter(a.content);
    const bDate = getDateInFrontMatter(b.content);

    return bDate.getTime() - aDate.getTime();
  });

  if (limit) {
    mdxContents = mdxContents.slice(0, limit);
  }

  if (tags.length > 0) {
    mdxContents = mdxContents.filter((m) => {
      const postTags = getTagsInFrontMatter(m.content);

      return tags.some((tag) => postTags.includes(tag));
    });
  }

  const posts = await Promise.all(
    mdxContents.map((m) => {
      return getPostFromMDXContent(
        m.content,
        `/posts/${slugs[m.slugIndex]}`,
        onlyPreview,
      );
    }),
  );

  return posts;
};
