import type { NextApiRequest, NextApiResponse } from 'next';

import { getPostBySlug } from '@/blog/getPosts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { slug } = req.query;

  if (typeof slug !== 'string' || !slug) {
    return res.status(400).json({ message: 'Invalid slug' });
  }

  try {
    const post = await getPostBySlug(slug);

    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Cache-Control',
        'public, max-age=3600, stale-while-revalidate=86400',
      );
    }

    return res.status(200).json({
      metadata: post.metadata,
      mdxSource: post.mdxSource,
    });
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return res.status(404).json({ message: 'Post not found' });
  }
}
