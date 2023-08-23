import { RawMatchData } from 'types/chesscom';

type Params = {
  matches?: Array<RawMatchData>;
  username: string;
};

export const useMatchesSummary = ({ matches, username }: Params) => {
  if (!matches) {
    return null;
  }

  const lastMatchResult =
    matches[0].user1.username === username
      ? matches[0].user1Result
      : matches[0].user2Result;

  const resultString = {
    0: 'losses',
    0.5: 'draws',
    1: 'wins',
  }[lastMatchResult];

  let streakCount = 1;

  for (let i = 1; i < matches.length; i += 1) {
    const match = matches[i];
    const result =
      match.user1.username === username ? match.user1Result : match.user2Result;

    if (result === lastMatchResult) {
      streakCount += 1;
    } else {
      break;
    }
  }

  const totalWins = matches.reduce((acc, match) => {
    const result =
      match.user1.username === username ? match.user1Result : match.user2Result;

    if (result === 1) {
      return acc + 1;
    }

    return acc;
  }, 0);
  const totalLosses = matches.reduce((acc, match) => {
    const result =
      match.user1.username === username ? match.user1Result : match.user2Result;

    if (result === 0) {
      return acc + 1;
    }

    return acc;
  }, 0);
  const totalDraws = matches.length - totalWins - totalLosses;

  return {
    streakCount,
    lastResult: resultString,
    totalMatches: matches.length,
    wins: totalWins,
    losses: totalLosses,
    draws: totalDraws,
  };
};
