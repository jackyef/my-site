import fs from 'fs';
import path from 'path';

import { serialize } from 'next-mdx-remote/serialize';

import {
  rehypePlugins,
  rehypePluginsForPreview,
} from '@/components/common/MDX/plugins/rehypePlugins';

import { PostMeta, Post } from './types';

type Opts = {
  limit?: number;
  onlyPreview?: boolean;
  tags?: string[];
};

const getDateInFrontMatter = (mdxContent: string) => {
  const firstDelimiter = mdxContent.indexOf('---');
  const secondDelimiter = mdxContent.indexOf('---', firstDelimiter + 1);

  const frontmatterContent = mdxContent.slice(
    firstDelimiter + 3,
    secondDelimiter,
  );

  const date = frontmatterContent.match(/date: (.*)/)?.[1] as string;

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
  const source = fs.readFileSync(mdxPath, 'utf8').toString();

  return !onlyPreview
    ? source
    : source.slice(0, source.indexOf('{/* !end-of-preview */}'));
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
    mdxSource,
  };
};

export const getPost = async (filePath: string) => {
  const mdxContent = getMDXContent(filePath);
  const rootPathStart = filePath.indexOf('src/pages');
  const link = filePath
    .replace('/index.mdx', '')
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

  let mdxContents = slugs.map((slug) => {
    const mdxPath = path.join(
      process.cwd(),
      './src/pages/posts',
      slug,
      'index.mdx',
    );

    return getMDXContent(mdxPath, onlyPreview);
  });

  mdxContents = mdxContents.sort((a, b) => {
    const aDate = getDateInFrontMatter(a);
    const bDate = getDateInFrontMatter(b);

    return bDate.getTime() - aDate.getTime();
  });

  if (limit) {
    mdxContents = mdxContents.slice(0, limit);
  }

  if (tags.length > 0) {
    mdxContents = mdxContents.filter((mdxContent) => {
      const postTags = getTagsInFrontMatter(mdxContent);

      return tags.some((tag) => postTags.includes(tag));
    });
  }

  const posts = await Promise.all(
    mdxContents.map((mdxContent, i) => {
      return getPostFromMDXContent(
        mdxContent,
        `/posts/${slugs[i]}`,
        onlyPreview,
      );
    }),
  );

  return posts;
};
