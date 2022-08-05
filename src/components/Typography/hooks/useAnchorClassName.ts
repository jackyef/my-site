import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

export const useAnchorClassName = () => {
  return css`
    color: ${getHslaColor('primary', 1, { l: -12 })};

    [data-theme='dark'] & {
      color: ${getHslaColor('primary')};
    }

    text-decoration: none;
    position: relative;
    transition: var(--transition-faster);
    box-shadow: inset 0 0em transparent,
      inset 0 -0.1em ${getHslaColor('primary')};

    &:hover,
    &:focus {
      color: ${getHslaColor('text')};

      box-shadow: inset 0 0em transparent,
        inset 0 -1.1em ${getHslaColor('primary', 0.2)};
    }
  `;
};
