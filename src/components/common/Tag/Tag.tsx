import { css } from 'goober';

import { cn } from '@/utils/styles/classNames';

interface Props {
  children?: React.ReactNode;
  variant: 'primary' | 'secondary';
}

export const Tag: React.FC<Props> = ({ children, variant }) => {
  const variantCss = css`
    --text-lightness: calc(var(--l-${variant}) - 12%);

    [data-theme='dark'] & {
      --text-lightness: var(--l-${variant});
    }

    color: hsl(var(--h-${variant}) var(--s-${variant}) var(--text-lightness));
    background: hsla(
      var(--h-${variant}) var(--s-${variant}) var(--l-${variant}) / 0.1
    );
    border-color: hsl(
      var(--h-${variant}) var(--s-${variant}) var(--l-${variant})
    );
    border-radius: 4rem;

    /* override focus style when children is focusable */
    &:focus-within {
      box-shadow: 0 0 0 3px currentColor;
    }

    &:focus-within *:focus {
      box-shadow: none !important;
      outline: none !important;
    }
  `;

  return (
    // Using 'em' here because we want to padding to grow relative to the font size
    <span className={cn('inline-block py-[0.25em] px-[0.5em]', variantCss)}>
      {children}
    </span>
  );
};
