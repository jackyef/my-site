import { cn } from '@/utils/styles/classNames';

interface HintItem {
  icon: string;
  label: string;
}

interface Props {
  hints?: HintItem[];
}

const DEFAULT_HINTS: HintItem[] = [
  { icon: '⊕', label: 'Select' },
  { icon: '⊗', label: 'Back' },
  { icon: '≡', label: 'Exit Big Picture' },
];

export const ButtonHints = ({ hints = DEFAULT_HINTS }: Props) => {
  return (
    <div
      className={cn(
        'flex items-center gap-6',
        'px-6 py-3',
        'border-t border-white/10',
        'text-sm text-white/50',
        'select-none',
      )}
    >
      {hints.map(({ icon, label }) => (
        <span key={label} className="flex items-center gap-1.5">
          <span
            className="text-white/70 font-bold"
            style={{ fontFamily: 'monospace', fontSize: '1rem' }}
          >
            {icon}
          </span>
          <span>{label}</span>
        </span>
      ))}
    </div>
  );
};
