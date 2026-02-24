import fs from 'fs';
import path from 'path';

import type { NextApiRequest, NextApiResponse } from 'next';

// Lightweight post list — only reads frontmatter, no MDX serialization
const getFrontmatter = (mdxContent: string) => {
  const firstDelimiter = mdxContent.indexOf('---');
  const secondDelimiter = mdxContent.indexOf('---', firstDelimiter + 1);
  if (firstDelimiter === -1 || secondDelimiter === -1) return null;
  return mdxContent.slice(firstDelimiter + 3, secondDelimiter);
};

const getField = (frontmatter: string, key: string): string => {
  const match = frontmatter.match(
    new RegExp(`${key}:\\s*['"]?([^'"\\n]+)['"]?`),
  );
  return match?.[1]?.trim() ?? '';
};

const getTagsField = (frontmatter: string): string[] => {
  const match = frontmatter.match(/tags:\s*(.*)/);
  if (!match) return [];
  try {
    return JSON.parse(match[1].replace(/'/g, '"'));
  } catch {
    return [];
  }
};

type PostListItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const postsDir = path.join(process.cwd(), 'src/pages/posts');
    const slugs = fs.readdirSync(postsDir);

    const posts: PostListItem[] = slugs
      .map((slug): PostListItem | null => {
        const mdxPath = path.join(postsDir, slug, 'index.mdx');
        if (!fs.existsSync(mdxPath)) return null;

        const source = fs.readFileSync(mdxPath, 'utf8');
        const frontmatter = getFrontmatter(source);
        if (!frontmatter) return null;

        return {
          slug,
          title: getField(frontmatter, 'title'),
          description: getField(frontmatter, 'description'),
          date: getField(frontmatter, 'date'),
          readingTime: getField(frontmatter, 'readingTime'),
          tags: getTagsField(frontmatter),
        };
      })
      .filter((p): p is PostListItem => p !== null)
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Cache-Control',
        'public, max-age=3600, stale-while-revalidate=86400',
      );
    }

    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Error listing posts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
