import { cn } from '@/utils/styles/classNames';

import { RESULTS_LISTBOX_ID } from './activeOption';

interface Props {
  children?: React.ReactNode;
}

export const ResultBox = ({ children }: Props) => {
  return (
    <>
      <div
        className={cn(
          'h-px',
          'w-full',
          'bg-(--color-border)',
          'transition-colors',
          'duration-500',
        )}
      />
      <div
        id={RESULTS_LISTBOX_ID}
        role="listbox"
        aria-label="available actions or results"
        className={cn(
          'flex',
          'flex-col',
          'py-1.5',
          'gap-0.5',
          'overflow-y-auto',
          'overflow-x-hidden',
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
