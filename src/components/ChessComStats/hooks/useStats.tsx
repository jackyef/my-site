import { useQueries } from 'react-query';

import {
  RawAllTimeStats,
  RawProfileStats,
  RawRecentMatchesResponse,
} from 'types/chesscom';

// @ts-expect-error
// eslint-disable-next-line
const fetchStats = async (username: string) => {
  // This endpoint is the documented API, but it returns different numbers
  // compared to what is displayed in the profile page
  // https://www.chess.com/stats/live/rapid/pixelparser/0
  const response = await fetch(
    `https://api.chess.com/pub/player/${username}/stats`,
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data as RawProfileStats;
};

const fetchAllTimeStats = async () => {
  const response = await fetch(`/api/chesscom/all-time-stats`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data as RawAllTimeStats;
};

const fetchMatchData = async () => {
  const response = await fetch(`/api/chesscom/recent-matches`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data as RawRecentMatchesResponse;
};

type Params = {
  userId: string;
};

export const useStats = ({ userId }: Params) => {
  const [stats, matches] = useQueries([
    // {
    //   queryKey: ['stats', username],
    //   staleTime: 1000 * 60 * 10,
    //   queryFn: () => fetchStats(username),
    // },
    {
      queryKey: ['allTimeStats', userId],
      staleTime: 1000 * 60 * 10,
      queryFn: () => fetchAllTimeStats(),
    },
    {
      queryKey: ['matches', userId], // Recent matches, max 20
      staleTime: 1000 * 60 * 10,
      queryFn: () => fetchMatchData(),
    },
  ]);

  return {
    stats: stats.data?.stats,
    matches: matches.data?.games,
  };
};
