import { animate, motion } from 'framer-motion';
import { BarChart2Icon } from 'lucide-react';
import { useRef } from 'react';

import { formatNumber } from '@/lib/number';

import { cn } from '@/utils/styles/classNames';

import { useStats } from './hooks/useStats';
import { useMatchesSummary } from './hooks/useMatchesSummary';
import { Record } from './Record';

// This is my chess.com information
// If you are copying this, remember to change this.
export const username = 'PixelParser';
const userId = '344047395'; // '288942993'; old banned account

export const ChessComStats = () => {
  const ratingRef = useRef<HTMLSpanElement>(null);
  const { stats, matches } = useStats({ username, userId });
  const matchesSummary = useMatchesSummary({ matches, username });

  // TODO: loading state
  if (!stats || !matchesSummary) return null;

  const rating = stats.chess_rapid.last.rating;

  console.log({ matchesSummary });

  return (
    <motion.div
      className={cn(
        'rounded-2xl text-theme-text p-6 my-4',
        'flex flex-col gap-4 relative overflow-clip',
        'isolate pr-[80px]',
        'bg-surface-3 shadow-surface-3 border-2 border-surface-5',
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background image */}
      <motion.img
        src="/assets/chesscom/chesscom.png"
        className={cn(
          'absolute z-[-1] object-contain h-full',
          'right-[-80px] bottom-[-60px]',
          'opacity-70',
        )}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.7, x: 0, transition: { delay: 0.2 } }}
      />
      <motion.dl
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.4 } }}
        onAnimationStart={() => {
          const node = ratingRef.current;

          if (!node) return;

          animate(0, rating, {
            type: 'spring',
            duration: 2,
            bounce: 0,
            onUpdate: (value) => {
              node.textContent = formatNumber(Math.round(value ?? 0));
            },
          });
        }}
      >
        <dt className="text-sm text-light uppercase tracking-wider text-theme-subtitle">
          Rating (rapid)
        </dt>
        <dd className={cn('text-4xl font-bold flex gap-1 items-center')}>
          <motion.span ref={ratingRef}>0</motion.span>{' '}
          <BarChart2Icon size={32} />
        </dd>
      </motion.dl>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.5 } }}
      >
        <Record
          title="All-time"
          label="All-time records"
          counts={{
            win: stats.chess_rapid.record.win,
            draw: stats.chess_rapid.record.draw,
            loss: stats.chess_rapid.record.loss,
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.6 } }}
      >
        <Record
          title={`Last ${matchesSummary.totalMatches}`}
          label={`Records in last ${matchesSummary.totalMatches} matches`}
          counts={{
            win: matchesSummary.wins,
            draw: matchesSummary.draws,
            loss: matchesSummary.losses,
          }}
        />
      </motion.div>

      {matchesSummary.streakCount > 1 && (
        <motion.dl
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.7 } }}
        >
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
        </motion.dl>
      )}
    </motion.div>
  );
};
