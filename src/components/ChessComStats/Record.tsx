import { css } from 'goober';
import clsx from 'clsx';
import { MinusSquareIcon, PlusSquareIcon, SquareEqualIcon } from 'lucide-react';

import { getHslaColor } from '@/lib/styles/colors';

type Props = {
  title: string;
  label: string;
  counts: {
    win: number;
    draw: number;
    loss: number;
  };
};

export const Record = ({
  title,
  label,
  counts: { win, draw, loss },
}: Props) => {
  const greenText = css`
    color: ${getHslaColor('primary', 1, { s: 5, h: 5 })};
  `;

  const redText = css`
    color: ${getHslaColor('secondary', 1, { s: 10, h: 75 })};
  `;

  return (
    <dl>
      <dt
        aria-label={label}
        className="text-sm text-light uppercase tracking-wider text-theme-subtitle"
      >
        {title}
      </dt>
      <dd className="flex gap-2 text-lg font-bold">
        <div className={clsx('flex gap-1 items-center', greenText)}>
          <span className="text-light">
            <PlusSquareIcon size={16} />
          </span>
          {win}
        </div>
        <div className={clsx('flex gap-1 items-center text-theme-subtitle')}>
          <span className="text-light">
            <SquareEqualIcon size={16} />
          </span>
          {draw}
        </div>
        <div className={clsx('flex gap-1 items-center', redText)}>
          <span className="text-light">
            <MinusSquareIcon size={16} />
          </span>
          {loss}
        </div>
      </dd>
    </dl>
  );
};
