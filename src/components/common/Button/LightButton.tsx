import { forwardRef, HTMLAttributes } from 'react';

import { cn } from '@/utils/styles/classNames';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const VARIANT_CLASSES = {
  primary:
    'text-(--color-accent-text) bg-(--color-accent-xl) border-(--color-accent) hover:bg-(--color-accent-l)',
  secondary:
    'text-(--color-danger) bg-(--color-danger-bg) border-(--color-danger) hover:opacity-80',
} as const;

/** @deprecated */
export const LightButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center px-4 py-2 rounded-full border transition-colors duration-150',
          VARIANT_CLASSES[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
