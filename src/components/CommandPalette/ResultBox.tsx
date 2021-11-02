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
        className={clsx(
          'mt-4',
          'flex',
          '-mx-4',
          '-mb-4',
          'flex-col',
          'py-4',
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
