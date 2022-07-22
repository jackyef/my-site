import type { NextApiRequest, NextApiResponse } from 'next';

import { search } from '@/utils/pageSearch';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const data = search(String(req.query.q));

    // set cache-control header for 3 days
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Cache-Control', 'public, max-age=259200');
    }

    return res.status(200).json({ data });
  }

  return res.status(403).json({ message: 'Forbidden' });
};
