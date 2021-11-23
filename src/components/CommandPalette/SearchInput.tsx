import clsx from 'clsx';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'search'> & {
  hasResults?: boolean;
};

export const SearchInput = ({ hasResults = false, ...props }: Props) => {
  return (
    <input
      className={clsx(
        'focusable-cmd-item', // Used to set focus

        {
          'rounded-lg': !hasResults,
          'rounded-t-lg': hasResults,
          'rounded-b-sm': hasResults,
        },

        'py-2',
        'px-4',
        'text-md',
        'md:text-lg',
        'bg-transparent',
        'outline-none',
        'w-full',
        'round',
      )}
      type="text"
      {...props}
    />
  );
};
