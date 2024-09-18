import { ChessComTimeControl } from 'types/chesscom';

import { BlitzIcon } from './icons/BlitzIcon';
import { RapidIcon } from './icons/RapidIcon';
import { BulletIcon } from './icons/BulletIcon';

type Props = {
  timeControl: ChessComTimeControl;
};

export const ChessComTimeControlIcon = ({ timeControl }: Props) => {
  const icon = {
    rapid: <RapidIcon width={19} height={19} />,
    blitz: <BlitzIcon width={20} height={20} />,
    bullet: <BulletIcon width={18} height={18} />,
  }[timeControl];

  return icon ?? null;
};
