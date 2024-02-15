import type { NextApiRequest, NextApiResponse } from 'next';

import { RawAllTimeStats } from 'types/chesscom';

import { chessComUsername } from '@/utils/constants';

// The purpose of the API is to bypass chess.com CORS
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const targetUrl = `https://www.chess.com/callback/stats/live/rapid/${chessComUsername}/0`;
      const response = await fetch(targetUrl, {
        headers: {
          Accept: 'application/json',
          referer: `https://www.chess.com/stats/live/rapid/${chessComUsername}/0`,
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = (await response.json()) as RawAllTimeStats;

      // set cache-control header for 10 minutes
      if (process.env.NODE_ENV === 'production') {
        res.setHeader('Cache-Control', 'public, max-age=1800');
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: 'Failed to get chess.com data', err: String(err) });
    }
  }

  return res.status(403).json({ message: 'Forbidden' });
};
