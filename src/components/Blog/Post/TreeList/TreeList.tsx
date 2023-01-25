import clsx from 'clsx';
import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

import { lineColorOpacity } from './styles';

type Props = {
  children?: React.ReactNode;
};

export const TreeList = ({ children }: Props) => {
  return (
    <ul
      className={clsx(
        'relative',
        css`
          & > li:last-child > .__tree-vertical-line {
            height: 0.125rem;
          }
        `,
      )}
    >
      <div
        className={clsx(
          'mt-4 ml-1 md:ml-8 w-[2px] h-8',
          'absolute',
          css`
            background: ${getHslaColor('primary', lineColorOpacity)};
          `,
        )}
      />
      {children}
    </ul>
  );
};
