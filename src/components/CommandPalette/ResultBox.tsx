import { cn } from '@/utils/styles/classNames';

interface Props {
  children?: React.ReactNode;
}

export const ResultBox = ({ children }: Props) => {
  return (
    <>
      <div
        className={cn(
          'my-4',
          'h-[2px]',
          'w-full',
          'transition-colors',
          'duration-500',
        )}
        style={{ background: 'var(--color-border)' }}
      />
      <div
        role="listbox"
        aria-label="available actions or results"
        className={cn(
          'mt-4',
          'flex',
          '-mx-4',
          '-mb-4',
          'flex-col',
          'pt-2',
          'pb-4',
          'space-y-2',
          'overflow-y-auto',
          'overflow-x-hidden',
          'max-h-full',
        )}
        style={{
          maxHeight: '40vh',
        }}
      >
        {children}
      </div>
    </>
  );
};
