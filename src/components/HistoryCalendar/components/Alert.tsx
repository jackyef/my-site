import clsx from 'clsx';
import { css } from 'goober';

import { BaseEvent } from '@/components/Timeline/TimelineEvent';

type Props = Pick<BaseEvent, 'title' | 'description' | 'variant'>;

export const Alert = ({ title, description, variant }: Props) => {
  return (
    <div
      className={clsx(
        'rounded-md p-2 md:p-4',
        css`
          filter: var(--filter-brightness);
        `,
        {
          'bg-slate-50': variant === 'slate',
          'bg-violet-50': variant === 'violet',
          'bg-red-50': variant === 'red',
          'bg-blue-50': variant === 'blue',
          'bg-green-50': variant === 'green',
          'bg-amber-50': variant === 'amber',
          'bg-fuchsia-50': variant === 'fuchsia',
          'bg-sky-50': variant === 'sky',
          'bg-teal-50': variant === 'teal',
        },
      )}
    >
      <div className="flex flex-col">
        <h3
          className={clsx('text-sm font-bold', {
            'text-slate-800': variant === 'slate',
            'text-violet-800': variant === 'violet',
            'text-red-800': variant === 'red',
            'text-blue-800': variant === 'blue',
            'text-green-800': variant === 'green',
            'text-amber-800': variant === 'amber',
            'text-fuchsia-800': variant === 'fuchsia',
            'text-sky-800': variant === 'sky',
            'text-teal-800': variant === 'teal',
          })}
        >
          {title}
        </h3>
        <div
          className={clsx('text-sm', {
            'text-slate-700': variant === 'slate',
            'text-violet-700': variant === 'violet',
            'text-red-700': variant === 'red',
            'text-blue-700': variant === 'blue',
            'text-green-700': variant === 'green',
            'text-amber-700': variant === 'amber',
            'text-fuchsia-700': variant === 'fuchsia',
            'text-sky-700': variant === 'sky',
            'text-teal-700': variant === 'teal',
          })}
        >
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};
