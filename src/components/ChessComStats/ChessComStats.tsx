import clsx from 'clsx';

import { formatNumber } from '@/lib/number';

import { useStats } from './hooks/useStats';
import { useMatchesSummary } from './hooks/useMatchesSummary';
import { Record } from './Record';

// This is my chess.com information
// If you are copying this, remember to change this.
export const username = 'PixelParser';
const userId = '288942993';

export const ChessComStats = () => {
  const { stats, matches } = useStats({ username, userId });
  const matchesSummary = useMatchesSummary({ matches, username });

  // TODO: loading state
  if (!stats || !matchesSummary) return null;

  const elo = formatNumber(stats.chess_rapid.last.rating);

  return (
    <div
      className={clsx(
        'rounded-2xl text-theme-text p-6 my-4',
        'flex flex-col gap-4 relative overflow-clip',
        'isolate pr-[80px]',
        'bg-surface-3 shadow-surface-3 border-2 border-surface-5',
      )}
    >
      {/* Background image */}
      <img
        src="/assets/chesscom/chesscom.png"
        className={clsx(
          'absolute z-[-1] object-contain h-full',
          'right-[-80px] bottom-[-60px]',
          'opacity-70',
        )}
      />
      <dl>
        <dt className="text-sm text-light uppercase tracking-wider text-theme-subtitle">
          Rating (rapid)
        </dt>
        <dd className={clsx('text-4xl font-bold')}>{elo}</dd>
      </dl>

      <Record
        title="All-time"
        label="All-time records"
        counts={{
          win: stats.chess_rapid.record.win,
          draw: stats.chess_rapid.record.draw,
          loss: stats.chess_rapid.record.loss,
        }}
      />

      <Record
        title={`Last ${matchesSummary.totalMatches}`}
        label={`Records in last ${matchesSummary.totalMatches} matches`}
        counts={{
          win: matchesSummary.wins,
          draw: matchesSummary.draws,
          loss: matchesSummary.losses,
        }}
      />

      {matchesSummary.streakCount > 1 && (
        <dl>
          <dt className="text-sm text-light uppercase tracking-wider text-theme-subtitle">
            Current streak
          </dt>
          <dd className="text-lg">
            {matchesSummary.streakCount} {matchesSummary.lastResult}{' '}
            <>
              {Array.from({
                length: Math.ceil(matchesSummary.streakCount / 3),
              }).fill(matchesSummary.lastResult === 'wins' ? '🔥' : '🥶')}
            </>
          </dd>
        </dl>
      )}
    </div>
  );
};
