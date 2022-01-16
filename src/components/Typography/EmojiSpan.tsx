import clsx from 'clsx';
import { FC } from 'react';

/**
 * Used to wrap emojis to hide them from screen readers.
 * Also force them to have normal font-weight to avoid
 * odd-looking emojis on Windows platform
 */
export const EmojiSpan: FC = ({ children }) => {
  return (
    <span aria-hidden className={clsx('font-normal')}>
      {children}
    </span>
  );
};
