import { cn } from '@/utils/styles/classNames';

export const ResultSectionSeparator = () => {
  return (
    <div className="last:hidden">
      <div
        className={cn(
          'my-2',
          'mx-6',
          'h-[2px]',
          'bg-(--color-border)',
          'transition-colors',
          'duration-500',
        )}
      />
    </div>
  );
};
