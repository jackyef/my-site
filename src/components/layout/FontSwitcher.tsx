import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, TypeIcon } from 'lucide-react';

import { cn } from '@/utils/styles/classNames';
import { FONT_PAIRINGS, getPairing, type PairingId } from '@/utils/fonts';

interface FontSwitcherProps {
  pairing: PairingId | null;
  onPairingChange: (id: PairingId) => void;
  /** Icon-only trigger, for when the label would cost more room than it earns. */
  compact?: boolean;
  /** Where the menu opens relative to the trigger. */
  anchor?: 'top start' | 'top end' | 'bottom start' | 'bottom end';
  /** Width and flex behaviour are the caller's to decide. */
  className?: string;
}

export function FontSwitcher({
  pairing,
  onPairingChange,
  compact,
  anchor = 'top start',
  className,
}: FontSwitcherProps) {
  const current = getPairing(pairing);

  return (
    <Listbox value={current.id} onChange={onPairingChange}>
      <ListboxButton
        title={`Reading font: ${current.label}`}
        aria-label={`Reading font: ${current.label}. Change it.`}
        className={cn(
          'flex items-center rounded-lg border border-(--color-border) bg-(--color-bg)',
          'text-(--color-ink-3) cursor-pointer font-[inherit]',
          'transition-[background,border-color,color] duration-[130ms]',
          'hover:bg-(--color-bg-hover) hover:border-(--color-accent-l) hover:text-(--color-ink-2)',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)',
          'data-open:border-(--color-accent-l) data-open:text-(--color-ink-2)',
          compact
            ? // The compact trigger is a 30px square under a cursor, which is
              // fine, and a 30px square under a thumb, which is not.
              'justify-center p-[7px] pointer-coarse:p-[15px]'
            : 'gap-[6px] px-[10px] py-[6px] text-[13px] text-left pointer-coarse:py-[12px]',
          className,
        )}
      >
        <TypeIcon size={compact ? 14 : 13} aria-hidden="true" />
        {!compact && (
          <span
            className="flex-1 truncate"
            style={{ fontFamily: `var(${current.cssVar})` }}
          >
            {current.label}
          </span>
        )}
      </ListboxButton>

      <ListboxOptions
        anchor={anchor}
        transition
        className={cn(
          'z-(--z-popover) w-[228px] max-h-[min(420px,60vh)] overflow-y-auto',
          'rounded-[10px] border border-(--color-border) bg-(--color-bg-panel)',
          'shadow-(--shadow-lg) p-1 [--anchor-gap:6px] [--anchor-padding:8px]',
          'origin-top transition duration-150 ease-out',
          'data-closed:opacity-0 data-closed:scale-95',
          'focus:outline-none',
        )}
      >
        {FONT_PAIRINGS.map((option) => (
          <ListboxOption
            key={option.id}
            value={option.id}
            className={cn(
              'group flex items-center gap-2 px-[10px] py-[7px] rounded-[7px] cursor-pointer',
              'text-(--color-ink-2) select-none',
              'data-focus:bg-(--color-bg-hover)',
              'data-selected:bg-(--color-bg-active) data-selected:text-(--color-accent-text)',
            )}
          >
            <span className="flex-1 min-w-0">
              <span
                className="block text-[14px] leading-[1.3] truncate"
                style={{ fontFamily: `var(${option.cssVar})` }}
              >
                {option.label}
              </span>
              {/* ink-3, not ink-4: this line is the only thing telling you
                  what the pairing is for, so it has to be readable on its
                  own. */}
              <span className="block text-[11px] leading-[1.4] mt-[1px] text-(--color-ink-3)">
                {option.description}
              </span>
            </span>
            <CheckIcon
              size={14}
              aria-hidden="true"
              className="shrink-0 opacity-0 group-data-selected:opacity-100"
            />
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
