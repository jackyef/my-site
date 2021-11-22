import { search } from '@/utils/pageSearch';
import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const results = search(String(req.query.q));

    // set cache-control header for 3 days
    res.setHeader('Cache-Control', 'public, max-age=259200');

    return res.status(200).json({ results });
  }

  return res.status(403).json({ message: 'Forbidden' });
};
