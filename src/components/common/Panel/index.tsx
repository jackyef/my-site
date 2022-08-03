import * as React from 'react';
import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

interface Props {
  type: 'warning' | 'info'; //  | 'error' | 'success';
  title: string;
  children?: React.ReactNode;
}

export const Panel: React.FC<Props> = ({
  type = 'warning',
  title = '',
  children,
}) => {
  const bgClass = css`
    background: ${getHslaColor(type)};
  `;

  return (
    // Different margins for x and y axis to account for the vertical spacing
    // that exists in text elements
    <div className={`rounded-lg my-8 px-5 pt-4 pb-1 ${bgClass}`}>
      <div className="font-bold text-xl mb-2">{title}</div>
      {children}
    </div>
  );
};
