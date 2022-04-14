import { css } from 'goober';
import clsx from 'clsx';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  isEnabled: boolean;
}
export const Button = ({ isEnabled, ...props }: Props) => {
  const bgColor = css`
    --button-bg: ${isEnabled ? 'var(--rgb-secondary)' : 'var(--rgb-primary)'};
  `;

  const button = css`
    display: inline-block;
    position: relative;
    padding: 0.5rem;
    border-radius: 50%;
    border: 2px solid;
    border-color: rgba(var(--button-bg), 0.6);
    background-color: rgba(var(--button-bg), 0.8);

    transition: var(--transition-faster);

    &:hover,
    &:focus {
      background-color: rgba(var(--button-bg), 0.1);
      transform: scale(1.2);

      & > svg {
        transition: var(--transition-faster);
        fill: rgba(var(--rgb-text), 1);
      }
    }

    & > svg {
      fill: rgba(var(--rgb-text), 0.9);
    }
  `;

  return <button {...props} className={clsx(bgColor, button)} />;
};
