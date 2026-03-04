import { Search } from 'lucide-react';

import { cn } from '@/utils/styles/classNames';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'search'> & {
  hasResults?: boolean;
};

export const SearchInput = ({
  hasResults: _hasResults = false,
  ...props
}: Props) => {
  return (
    <div className="relative flex items-center">
      <Search
        size={16}
        className="absolute left-3 text-(--color-ink-4)"
        aria-hidden="true"
      />
      <input
        className={cn(
          'focusable-cmd-item',
          'pl-9 pr-3 py-2.5',
          'text-sm',
          'bg-transparent',
          'outline-none',
          'w-full',
          'placeholder:text-(--color-ink-4)',
          'text-(--color-ink)',
        )}
        type="text"
        {...props}
      />
    </div>
  );
};
