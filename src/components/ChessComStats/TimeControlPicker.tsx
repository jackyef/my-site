import { motion } from 'framer-motion';
import { css } from 'goober';

import { ChessComTimeControl } from 'types/chesscom';

import { cn } from '@/utils/styles/classNames';

import { ChessComTimeControlIcon } from './ChessComTimeCategoryIcon';

const TIME_CONTROLS = ['rapid', 'blitz', 'bullet'] as const;

type Props = {
  value: ChessComTimeControl;
  onChange: (value: ChessComTimeControl) => void;
};

export const TimeControlPicker = ({ value, onChange }: Props) => {
  return (
    <motion.div
      layout
      className={cn(
        'inline-flex gap-2 items-center bg-surface-3 rounded-xl w-fit overflow-clip border border-surface-5',
        css`
          backdrop-filter: contrast(120%) saturate(120%) blur(8px);
        `,
      )}
    >
      {TIME_CONTROLS.map((timeControl) => {
        const isActive = value === timeControl;

        return (
          <button
            key={timeControl}
            aria-label={timeControl}
            className={cn(
              'flex flex-1 opacity-30 relative py-2 px-6 items-center justify-center transition-all outline-none focus:outline-none',
              {
                'opacity-100 bg-surface-1': isActive,
              },
            )}
            onClick={() => onChange(timeControl)}
          >
            <div
              style={
                // Some specific styling for vertical alignment
                timeControl === 'rapid'
                  ? { transform: 'translateY(-1px)' }
                  : undefined
              }
            >
              <ChessComTimeControlIcon timeControl={timeControl} />
            </div>
          </button>
        );
      })}
    </motion.div>
  );
};
