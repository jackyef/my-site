import { cn } from '@/utils/styles/classNames';

interface Props {
  hasError: boolean;
  children?: React.ReactNode;
}

export const Container = ({ children, hasError }: Props) => {
  return (
    <div
      className={cn(
        'lg:mx-8 mt-8 mb-16 p-8 rounded-2xl border-2',
        hasError
          ? 'text-(--color-danger) bg-(--color-danger-bg) border-(--color-danger)'
          : 'border-(--color-border)',
      )}
    >
      {children}
    </div>
  );
};
