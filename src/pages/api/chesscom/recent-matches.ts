import type { NextApiRequest, NextApiResponse } from 'next';

import { RawMatchData } from 'types/chesscom';

// This is my chess.com information
// If you are copying this, remember to change this.
const userId = '288942993';

// The purpose of the API is to bypass chess.com CORS
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const targetUrl = `https://www.chess.com/callback/user/games?locale=en_US&userId=${userId}`;
      const response = await fetch(targetUrl);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = (await response.json()) as RawMatchData;

      // set cache-control header for 3 hour
      if (process.env.NODE_ENV === 'production') {
        res.setHeader('Cache-Control', 'public, max-age=32400');
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: 'Failed to get chess.com data', err });
    }
  }

  return res.status(403).json({ message: 'Forbidden' });
};
