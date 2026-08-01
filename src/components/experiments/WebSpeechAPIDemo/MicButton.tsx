import { type HTMLAttributes } from 'react';

import { cn } from '@/utils/styles/classNames';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  isEnabled: boolean;
}

export const MicButton = ({ isEnabled, className, style, ...props }: Props) => {
  const color = isEnabled ? 'var(--color-danger)' : 'var(--color-accent)';

  return (
    <button
      {...props}
      className={cn(
        // Named properties, not `all` — this button also animates a ::before
        // ping, and `transition: all` picks up every property that ever
        // changes on it, including ones no one meant to animate.
        'inline-block relative rounded-full p-2 border-2 transition-[transform,border-color,background-color] duration-150',
        'hover:scale-[1.2] focus:scale-[1.2]',
        '[&>svg]:transition-colors [&>svg]:duration-150',
        className,
      )}
      style={{
        borderColor: color,
        backgroundColor: color,
        ...style,
      }}
    />
  );
};
