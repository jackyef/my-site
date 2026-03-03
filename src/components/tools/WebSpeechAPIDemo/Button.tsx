import { type HTMLAttributes } from 'react';

import { cn } from '@/utils/styles/classNames';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  isEnabled: boolean;
}

export const Button = ({ isEnabled, className, style, ...props }: Props) => {
  const color = isEnabled ? 'var(--color-danger)' : 'var(--color-accent)';

  return (
    <button
      {...props}
      className={cn(
        'inline-block relative rounded-full p-2 border-2 transition-all duration-150',
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
