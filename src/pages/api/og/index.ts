import getMetaData from 'metadata-scraper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const targetUrl = new URL(String(req.query.url));

      const metadata = await getMetaData(targetUrl.toString());

      // set cache-control header for 1 day
      if (process.env.NODE_ENV === 'production') {
        res.setHeader('Cache-Control', 'public, max-age=259200');
      }

      return res.status(200).json({ metadata });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Invalid URL' });
    }
  }

  return res.status(403).json({ message: 'Forbidden' });
};
