import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

interface Props extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

/**
 * When used in a nested list, only use this for the outermost `<ul>`.
 */
export const UnorderedList = ({ children, ...props }: Props) => {
  const baseClass = css`
    & li::before {
      content: '•';
      display: inline-block;
      font-size: 150%;
      line-height: 0;
      margin-right: 0.5rem;
      position: relative;
      top: 0.07rem;
    }

    & li::before {
      color: ${getHslaColor('secondary')};
    }

    & ul {
      padding-left: 1.5rem;
    }

    & ul li::before {
      color: ${getHslaColor('primary')};
    }

    & ul ul li::before {
      color: ${getHslaColor('tertiary')};
    }
  `;

  return (
    <ul className={baseClass} {...props}>
      {children}
    </ul>
  );
};
