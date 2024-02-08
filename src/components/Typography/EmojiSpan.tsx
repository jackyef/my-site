import { cn } from '@/utils/styles/classNames';

interface Props {
  children?: React.ReactNode;
}

/**
 * Used to wrap emojis to hide them from screen readers.
 * Also force them to have normal font-weight to avoid
 * odd-looking emojis on Windows platform
 */
export const EmojiSpan = ({ children }: Props) => {
  return (
    <span aria-hidden className={cn('font-normal')}>
      {children}
    </span>
  );
};
