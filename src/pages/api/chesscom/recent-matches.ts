import type { NextApiRequest, NextApiResponse } from 'next';

import { RawRecentMatchesResponse } from 'types/chesscom';

import { chessComUserId } from '@/utils/constants';
import { isValidTimeControl } from '@/utils/chessCom';

const userId = chessComUserId;

// The purpose of the API is to bypass chess.com CORS
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const timeControl = String(req.query.timeControl) ?? 'rapid';

  if (req.method === 'GET' && isValidTimeControl(timeControl)) {
    try {
      const targetUrl = `https://www.chess.com/callback/user/games?locale=en_US&gameType=chess&gameTimeClass=${timeControl}&userId=${userId}`;
      const response = await fetch(targetUrl);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = (await response.json()) as RawRecentMatchesResponse;

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
