import { motion } from 'motion/react';

import { SegmentedControl } from '@/components/common/SegmentedControl';
import { ChessComTimeControl } from 'types/chesscom';

import { ChessComTimeControlIcon } from './ChessComTimeCategoryIcon';

const TIME_CONTROLS = ['rapid', 'blitz', 'bullet'] as const;

const OPTIONS = TIME_CONTROLS.map((timeControl) => ({
  value: timeControl,
  title: timeControl,
  icon: <ChessComTimeControlIcon timeControl={timeControl} />,
}));

type Props = {
  value: ChessComTimeControl;
  onChange: (value: ChessComTimeControl) => void;
};

export const TimeControlPicker = ({ value, onChange }: Props) => {
  return (
    <motion.div layout className="w-fit">
      <SegmentedControl
        options={OPTIONS}
        value={value}
        onChange={onChange}
        className="gap-1 px-1"
      />
    </motion.div>
  );
};
