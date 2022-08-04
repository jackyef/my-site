import clsx from 'clsx';

export const ResultSectionSeparator = () => {
  return (
    <div className="last:hidden">
      <div
        className={clsx(
          'my-2',
          'mx-6',
          'h-[2px]',
          'bg-surface-3',
          'transition-colors',
          'duration-500',
        )}
      />
    </div>
  );
};
