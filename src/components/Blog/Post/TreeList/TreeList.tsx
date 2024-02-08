import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

import { cn } from '@/utils/styles/classNames';

import { lineColorOpacity } from './styles';

type Props = {
  children?: React.ReactNode;
};

export const TreeList = ({ children }: Props) => {
  return (
    <ul
      className={cn(
        'relative',
        css`
          & > li:last-child > .__tree-vertical-line {
            height: 0.125rem;
          }
        `,
      )}
    >
      <div
        className={cn(
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
