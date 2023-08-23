import { useQueries } from 'react-query';

import { RawMatchData, RawProfileStats } from 'types/chesscom';

const fetchStats = async (username: string) => {
  const response = await fetch(
    `https://api.chess.com/pub/player/${username}/stats`,
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data as RawProfileStats;
};

const fetchMatchData = async () => {
  const response = await fetch(`/api/chesscom/recent-matches`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data as Array<RawMatchData>;
};

type Params = {
  username: string;
  userId: string;
};

export const useStats = ({ username, userId }: Params) => {
  const [stats, matches] = useQueries([
    {
      queryKey: ['stats', username],
      staleTime: 1000 * 60 * 10,
      queryFn: () => fetchStats(username),
    },
    {
      queryKey: ['matches', userId], // Recent matches, max 20
      staleTime: 1000 * 60 * 10,
      queryFn: () => fetchMatchData(),
    },
  ]);

  return {
    stats: stats.data,
    matches: matches.data,
  };
};
