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

export const getPosts = async ({
  limit,
  onlyPreview = false,
}: Opts = {}): Promise<Post[]> => {
  const slugs = fs.readdirSync(path.join(process.cwd(), './src/pages/posts'));

  let mdxContents = slugs.map((slug) => {
    const mdxPath = path.join(
      process.cwd(),
      './src/pages/posts',
      slug,
      'index.mdx',
    );
    const source = fs.readFileSync(mdxPath, 'utf8').toString();

    return !onlyPreview
      ? source
      : source.slice(0, source.indexOf('{/* !end-of-preview */}'));
  });

  mdxContents = mdxContents.sort((a, b) => {
    const aDate = getDateInFrontMatter(a);
    const bDate = getDateInFrontMatter(b);

    return bDate.getTime() - aDate.getTime();
  });

  if (limit) {
    mdxContents = mdxContents.slice(0, limit);
  }

  const mdxSources = await Promise.all(
    mdxContents.map((mdxContent) => {
      return serialize(mdxContent, {
        parseFrontmatter: true,
        mdxOptions: {
          rehypePlugins: !onlyPreview ? rehypePlugins : rehypePluginsForPreview,
          format: 'mdx',
        },
      });
    }),
  );

  return mdxSources.map((mdxSource, i) => {
    const frontmatter = mdxSource.frontmatter as unknown as PostMeta;

    return {
      link: `/posts/${slugs[i]}`,
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
  });
};
