import { cn } from '@/utils/styles/classNames';

export interface SegmentOption<T> {
  value: T;
  label?: string;
  icon?: React.ReactNode;
  title?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
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
        'flex rounded-[8px] border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg)]',
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          title={opt.title ?? opt.label}
          aria-label={opt.label ? `Switch to ${opt.label}` : undefined}
          aria-pressed={value === opt.value}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-[9px] py-[5px] text-[11px] font-medium cursor-pointer border-none font-[inherit] transition-[background,color] duration-[130ms]',
            value === opt.value
              ? 'bg-[var(--color-bg-active)] text-[var(--color-accent-text)]'
              : 'bg-transparent text-[var(--color-ink-4)]',
          )}
        >
          {opt.icon}
          {opt.label && <span className={labelClassName}>{opt.label}</span>}
        </button>
      ))}
    </div>
  );
}
