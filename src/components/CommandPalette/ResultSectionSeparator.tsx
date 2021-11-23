import clsx from 'clsx';

export const ResultSectionSeparator = () => {
  return (
    <div>
      <div
        className={clsx(
          'my-2',
          'mx-6',
          'h-[2px]',
          'w-full',
          'bg-theme-backgroundOffset',
          'transition-colors',
          'duration-500',
        )}
      />
    </div>
  );
};
