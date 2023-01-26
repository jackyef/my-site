import clsx from 'clsx';
import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

import { lineColorOpacity } from './styles';

type Props = {
  children?: React.ReactNode;
};

export const TreeListItem = ({ children }: Props) => {
  return (
    <li className="pb-4 pt-8 relative">
      <div
        className={clsx(
          '__tree-vertical-line',
          'mt-4 ml-1 md:ml-8 w-[2px] h-full',
          'absolute',
          css`
            background: ${getHslaColor('primary', lineColorOpacity)};
          `,
        )}
      />
      <div
        className={clsx(
          'mt-4 ml-1.5 md:ml-[2.125rem] w-1 md:w-4 h-[2px]',
          'absolute',
          css`
            background: ${getHslaColor('primary', lineColorOpacity)};
          `,
        )}
      />
      {children}
    </li>
  );
};
