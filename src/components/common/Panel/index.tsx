import * as React from 'react';
import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';
import { HSLColor } from '@/lib/styles/tokens';

interface Props {
  type: HSLColor;
  title: string;
  children?: React.ReactNode;
}

export const Panel: React.FC<Props> = ({
  type = 'primary',
  title = '',
  children,
}) => {
  const base = css`
    color: ${getHslaColor(type, 1, { l: -12 })};

    [data-theme='dark'] & {
      color: ${getHslaColor(type)};
    }

    background: ${getHslaColor(type, 0.1)};
    border-color: ${getHslaColor(type)};
    border-radius: 0.5rem;
  `;

  return (
    // Different margins for x and y axis to account for the vertical spacing
    // that exists in text elements
    <div className={`rounded-lg my-8 px-5 pt-4 pb-1 ${base}`}>
      <div className="font-bold text-xl mb-2">{title}</div>
      {children}
    </div>
  );
};
