import { SearchIcon } from 'lucide-react';

import { cn } from '@/utils/styles/classNames';

import { RESULTS_LISTBOX_ID } from './activeOption';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'search'> & {
  hasResults?: boolean;
  /** The row the arrow keys are currently pointing at, if any. */
  activeId?: string | null;
};

export const SearchInput = ({
  hasResults = false,
  activeId,
  ...props
}: Props) => {
  // No focus ring on this input, on purpose. `outline-none` used to be a real
  // gap — you could arrow up onto the field and lose all trace of where you
  // were. Focus now never leaves it while the palette is open, so the caret
  // marks the input and the highlighted row marks the selection; a permanent
  // ring around a permanently-focused field would only add noise.
  return (
    <div className="relative flex items-center">
      <SearchIcon
        size={16}
        className="absolute left-3 text-(--color-ink-4)"
        aria-hidden="true"
      />
      <input
        className={cn(
          'focusable-cmd-item',
          'pl-9 pr-3 py-2.5',
          // 16px, not 14px: iOS Safari zooms the page in when a focused input
          // is any smaller, and it does not zoom back out afterwards.
          'text-base',
          'bg-transparent',
          'outline-none',
          'w-full',
          'placeholder:text-(--color-ink-4)',
          'text-(--color-ink)',
        )}
        type="text"
        role="combobox"
        aria-label="Search actions and pages"
        aria-expanded={hasResults}
        aria-controls={hasResults ? RESULTS_LISTBOX_ID : undefined}
        aria-activedescendant={activeId ?? undefined}
        aria-autocomplete="list"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        {...props}
      />
    </div>
  );
};
