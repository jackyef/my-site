import { css } from 'goober';
import clsx from 'clsx';

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
        <div className={clsx(greenText)}>
          {win} <span className="text-light">W</span>
        </div>
        <div>
          {draw} <span className="text-light">D</span>
        </div>
        <div className={clsx(redText)}>
          {loss} <span className="text-light">L</span>
        </div>
      </dd>
    </dl>
  );
};
