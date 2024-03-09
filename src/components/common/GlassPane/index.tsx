import { css } from 'goober';
import { ComponentProps } from 'react';

import { getHslString, getHslaColor } from '@/lib/styles/colors';

import { cn } from '@/utils/styles/classNames';

export const GlassPane = ({ className, ...props }: ComponentProps<'div'>) => {
  const container = css`
    --bg-opacity: 0.4;
    background: hsla(${getHslString('bg')} / var(--bg-opacity));
    backdrop-filter: contrast(105%) saturate(120%) blur(8px);

    @supports (backdrop-filter: blur(8px)) {
      --bg-opacity: 0.2;
      box-shadow: 0 6px 6px 0px ${getHslaColor('bg', 0.4)};
    }
  `;
  return <div className={cn(container, 'rounded-2xl', className)} {...props} />;
};
