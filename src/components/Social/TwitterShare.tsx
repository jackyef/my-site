import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

import { cn } from '@/utils/styles/classNames';

interface Props {
  text: string;
  children?: React.ReactNode;
}

export const TwitterShare: React.FC<Props> = ({ text, children }) => (
  <a
    className={cn(
      'hover:underline',
      css`
        color: ${getHslaColor('primary', 1, { l: -12 })};
      `,
    )}
    target="_blank"
    rel="noreferrer"
    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`}
    data-size="large"
  >
    {children}
  </a>
);
