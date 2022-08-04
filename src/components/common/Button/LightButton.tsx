import { css } from 'goober';
import { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

import { getHslaColor } from '@/lib/styles/colors';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const LightButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', className, ...props }, ref) => {
    const base = css`
      color: ${getHslaColor(variant, 1, { l: -12 })};

      [data-theme='dark'] & {
        color: ${getHslaColor(variant)};
      }

      background: ${getHslaColor(variant, 0.1)};
      border-color: ${getHslaColor(variant)};
      border-radius: 0.5rem;

      &:hover,
      &:focus {
        background: ${getHslaColor(variant, 0.08)};
      }
    `;

    return (
      <button
        ref={ref}
        className={clsx(base, 'px-4', 'py-2', className)}
        {...props}
      />
    );
  },
);
