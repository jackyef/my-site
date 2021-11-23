import clsx from 'clsx';

export const ResultSectionHeading: React.FC = ({ children }) => {
  return (
    <h3
      className={clsx(
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
