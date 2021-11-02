import clsx from 'clsx';

export const ResultBox: React.FC = ({ children }) => {
  return (
    <>
      <div
        className={clsx(
          'my-4',
          'h-[2px]',
          'w-full',
          'bg-theme-backgroundOffset',
          'transition-colors',
          'duration-500',
        )}
      />
      <div
        role="listbox"
        aria-label="available actions or results"
        className={clsx('mt-4', 'flex', 'flex-col', 'space-y-2')}
      >
        {children}
      </div>
    </>
  );
};
