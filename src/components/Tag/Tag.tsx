import clsx from 'clsx';
import { css } from 'goober';

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
    border-radius: 0.5rem;

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
    <span className={clsx('inline-block py-1 px-2', variantCss)}>
      {children}
    </span>
  );
};
