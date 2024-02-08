import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

import { cn } from '@/utils/styles/classNames';

interface Props {
  hasError: boolean;
  children?: React.ReactNode;
}

export const Container = ({ children, hasError }: Props) => {
  const errorContainerClass = css`
    color: ${getHslaColor('secondary')};
    background: ${getHslaColor('secondary', 0.1)};
    border-color: ${getHslaColor('secondary', 0.6)} !important;
  `;

  return (
    <div
      className={cn(
        'lg:mx-8',
        'mt-8',
        'mb-16',
        'p-8',
        'rounded-2xl',
        'border-2',
        'border-surface-0',
        {
          [errorContainerClass]: hasError,
        },
      )}
    >
      {children}
    </div>
  );
};
