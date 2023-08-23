import clsx from 'clsx';

import { formatNumber } from '@/lib/number';

import { useStats } from './hooks/useStats';
import { useMatchesSummary } from './hooks/useMatchesSummary';

// This is my chess.com information
// If you are copying this, remember to change this.
const username = 'PixelParser';
const userId = '288942993';

export const ChessComStats = () => {
  const { stats, matches } = useStats({ username, userId });
  const matchesSummary = useMatchesSummary({ matches, username });

  console.log({ stats, matches });

  // TODO: loading state
  if (!stats || !matchesSummary) return null;

  const elo = formatNumber(stats.chess_rapid.last.rating);

  return (
    <div
      className={clsx(
        'rounded-lg bg-theme-background text-theme-text p-4 my-4',
        'flex flex-col',
      )}
    >
      <div>
        Stats for {username}
        <div className={clsx('text-2xl font-bold')}>Rating {elo}</div>
      </div>

      <div>
        <div>Records</div>
        <div>
          <div>
            Wins: {stats.chess_rapid.record.win} Losses:{' '}
            {stats.chess_rapid.record.loss} Draws:{' '}
            {stats.chess_rapid.record.draw}
          </div>
        </div>
      </div>

      <div>
        Current streak: {matchesSummary.streakCount} {matchesSummary.lastResult}
        <div>
          <div>Last {matchesSummary.totalMatches}</div>
          <div>{matchesSummary.wins} wins</div>
          <div>{matchesSummary.draws} draws</div>
          <div>{matchesSummary.losses} losses</div>
        </div>
      </div>
    </div>
  );
};
