import { css } from 'goober';
import clsx from 'clsx';
import React from 'react';

import { getHslaColor, getHslString } from '@/lib/styles/colors';
interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  isEnabled: boolean;
}
export const Button = ({ isEnabled, ...props }: Props) => {
  const bgColor = css`
    --button-hsl: ${getHslString(isEnabled ? 'secondary' : 'primary')};
  `;

  const button = css`
    display: inline-block;
    position: relative;
    padding: 0.5rem;
    border-radius: 50%;
    border: 2px solid;
    border-color: hsla(var(--button-hsl) / 0.6);
    background-color: hsla(var(--button-hsl) / 0.8);

    transition: var(--transition-faster);

    &:hover,
    &:focus {
      background-color: hsla(var(--button-hsl) / 0.1);
      transform: scale(1.2);

      & > svg {
        transition: var(--transition-faster);
        fill: ${getHslaColor('text')};
      }
    }

    & > svg {
      fill: ${getHslaColor('text', 0.9)};
    }
  `;

  return <button {...props} className={clsx(bgColor, button)} />;
};
