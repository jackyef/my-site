import type { NextApiRequest, NextApiResponse } from 'next';

import { RawMatchData } from 'types/chesscom';

import { chessComUserId } from '@/utils/constants';

const userId = chessComUserId;

// The purpose of the API is to bypass chess.com CORS
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const targetUrl = `https://www.chess.com/callback/user/games?locale=en_US&gameType=chess&gameTimeClass=rapid&userId=${userId}`;
      const response = await fetch(targetUrl);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = (await response.json()) as RawMatchData;

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
