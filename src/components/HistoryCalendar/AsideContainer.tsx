import { CSSProperties } from 'react';

import { cn } from '@/utils/styles/classNames';

import { JobHistoryEvent } from './constants';

type Props = {
  variant?: JobHistoryEvent['variant'];
  children: React.ReactNode;
};
export const AsideContainer = ({ variant, children }: Props) => {
  return (
    <div
      style={{ textWrap: 'balance' } as CSSProperties}
      className={cn(
        'pb-10 min-h-full',
        'transition-colors duration-700 isolate',
        {
          'bg-slate-50 text-slate-700': variant === 'slate',
          'bg-violet-50 text-violet-700': variant === 'violet',
          'bg-red-50 text-red-700': variant === 'red',
          'bg-blue-50 text-blue-700': variant === 'blue',
          'bg-green-50 text-green-700': variant === 'green',
          'bg-amber-50 text-amber-700': variant === 'amber',
        },
      )}
    >
      {children}
    </div>
  );
};
