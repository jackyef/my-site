import clsx from 'clsx';

interface Props {
  children?: React.ReactNode;
}

export const ResultBox = ({ children }: Props) => {
  return (
    <>
      <div
        className={clsx(
          'my-4',
          'h-[2px]',
          'w-full',
          'bg-surface-3',
          'transition-colors',
          'duration-500',
        )}
      />
      <div
        role="listbox"
        aria-label="available actions or results"
        className={clsx(
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
