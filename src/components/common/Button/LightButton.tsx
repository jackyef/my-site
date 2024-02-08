import { css } from 'goober';
import { forwardRef, HTMLAttributes } from 'react';

import { getHslaColor } from '@/lib/styles/colors';

import { cn } from '@/utils/styles/classNames';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const LightButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', className, ...props }, ref) => {
    const base = css`
      display: inline-flex;
      align-items: center;
      color: ${getHslaColor(variant, 1, { l: -12 })};

      [data-theme='dark'] & {
        color: ${getHslaColor(variant)};
      }

      background: ${getHslaColor(variant, 0.1)};
      border-color: ${getHslaColor(variant)};
      border-radius: 4rem;

      &:hover,
      &:focus {
        background: ${getHslaColor(variant, 0.08)};
      }
    `;

    return (
      <button
        ref={ref}
        className={cn(base, 'px-4', 'py-2', className)}
        {...props}
      />
    );
  },
);
