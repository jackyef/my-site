import { cn } from '@/utils/styles/classNames';

export interface SegmentOption<T> {
  value: T;
  label?: string;
  icon?: React.ReactNode;
  title?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
  labelClassName?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  labelClassName,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'flex rounded-[10px] p-[3px] overflow-hidden bg-(--color-bg) shadow-(--shadow-inset)',
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          title={opt.title ?? opt.label}
          aria-label={opt.label ? `Switch to ${opt.label}` : opt.title}
          aria-pressed={value === opt.value}
          className={cn(
            // 5px of padding is plenty under a cursor and nowhere near enough
            // under a thumb — these segments measured 23px tall on a phone.
            // The touch bump is scoped to coarse pointers so the desktop
            // sidebar keeps its compact control.
            'flex-1 flex items-center justify-center gap-1 px-[9px] py-[5px] pointer-coarse:py-[16px] text-[11px] font-medium cursor-pointer border-none font-[inherit] rounded-[7px] transition-[background,color,box-shadow] duration-[130ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--color-focus-ring)',
            value === opt.value
              ? 'bg-(--color-bg-panel) text-(--color-accent-text) shadow-(--shadow-thumb)'
              : // ink-3, not ink-4: the unselected segments are the ones you
                // have to read to know what you would be switching to, and
                // ink-4 is the decorative tier at roughly 2.5:1.
                'bg-transparent text-(--color-ink-3)',
          )}
        >
          {opt.icon}
          {opt.label && (
            <span className={cn('leading-0', labelClassName)}>{opt.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}
