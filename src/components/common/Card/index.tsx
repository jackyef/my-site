import { Surface } from '@/components/common/Surface';

import { cn } from '@/utils/styles/classNames';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md';
  as?: React.ElementType;
}

const paddingMap = {
  none: '',
  sm: 'px-[14px] py-[12px]',
  md: 'px-[20px] py-[16px]',
};

export function Card({
  children,
  className,
  hover,
  padding = 'none',
  as,
}: CardProps) {
  return (
    <Surface
      as={as}
      rounded="xl"
      className={cn(
        'card',
        hover && 'card-hover',
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </Surface>
  );
}
