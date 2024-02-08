import { cn } from '@/utils/styles/classNames';

interface Props {
  children?: React.ReactNode;
}

export const ResultSectionHeading = ({ children }: Props) => {
  return (
    <h3
      className={cn(
        'px-6',
        'text-sm',
        'uppercase',
        'tracking-wider',
        'font-semibold',
      )}
    >
      {children}
    </h3>
  );
};
