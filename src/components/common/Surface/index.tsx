import { cn } from '@/utils/styles/classNames';

interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

const elevationMap = {
  none: '',
  sm: 'shadow-(--shadow-sm)',
  md: 'shadow-(--shadow-md)',
  lg: 'shadow-(--shadow-lg)',
};

const roundedMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
};

export function Surface({
  elevation = 'sm',
  rounded = 'lg',
  border = true,
  as: As = 'div',
  className,
  children,
  ...rest
}: SurfaceProps) {
  return (
    <As
      className={cn(
        'bg-(--color-bg-panel)',
        elevationMap[elevation],
        roundedMap[rounded],
        border && 'border border-(--color-border)',
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}
