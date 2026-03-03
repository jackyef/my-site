import { cn } from '@/utils/styles/classNames';

const BG_TOKENS = [
  { name: 'bg', token: '--color-bg' },
  { name: 'bg-panel', token: '--color-bg-panel' },
  { name: 'bg-sidebar', token: '--color-bg-sidebar' },
  { name: 'bg-hover', token: '--color-bg-hover' },
  { name: 'bg-active', token: '--color-bg-active' },
];

const INK_TOKENS = [
  { name: 'ink', token: '--color-ink' },
  { name: 'ink-2', token: '--color-ink-2' },
  { name: 'ink-3', token: '--color-ink-3' },
  { name: 'ink-4', token: '--color-ink-4' },
];

const ACCENT_TOKENS = [
  { name: 'accent', token: '--color-accent' },
  { name: 'accent-text', token: '--color-accent-text' },
  { name: 'accent-l', token: '--color-accent-l' },
  { name: 'accent-xl', token: '--color-accent-xl' },
];

const SEMANTIC_TOKENS = [
  { name: 'info', token: '--color-info', bg: '--color-info-bg' },
  { name: 'success', token: '--color-success', bg: '--color-success-bg' },
  { name: 'warning', token: '--color-warning', bg: '--color-warning-bg' },
  { name: 'danger', token: '--color-danger', bg: '--color-danger-bg' },
];

function Swatch({
  color,
  label,
  className,
}: {
  color: string;
  label: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'w-20 h-20 rounded-lg border border-(--color-border)',
          className,
        )}
        style={{ backgroundColor: `var(${color})` }}
      />
      <span className="text-[11px] text-(--color-ink-3) font-mono">
        {label}
      </span>
    </div>
  );
}

export const Surfaces = () => {
  return (
    <div className="flex gap-4 flex-wrap">
      {BG_TOKENS.map(({ name, token }) => (
        <Swatch key={name} color={token} label={name} />
      ))}
    </div>
  );
};

export const Colors = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[12px] font-semibold text-(--color-ink-3) uppercase tracking-wide mb-2">
          Ink
        </div>
        <div className="flex gap-4 flex-wrap">
          {INK_TOKENS.map(({ name, token }) => (
            <Swatch key={name} color={token} label={name} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-[12px] font-semibold text-(--color-ink-3) uppercase tracking-wide mb-2">
          Accent
        </div>
        <div className="flex gap-4 flex-wrap">
          {ACCENT_TOKENS.map(({ name, token }) => (
            <Swatch key={name} color={token} label={name} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-[12px] font-semibold text-(--color-ink-3) uppercase tracking-wide mb-2">
          Semantic
        </div>
        <div className="flex gap-4 flex-wrap">
          {SEMANTIC_TOKENS.map(({ name, token, bg }) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className="flex gap-1">
                <div
                  className="w-20 h-20 rounded-lg border border-(--color-border)"
                  style={{ backgroundColor: `var(${token})` }}
                />
                <div
                  className="w-20 h-20 rounded-lg border border-(--color-border)"
                  style={{ backgroundColor: `var(${bg})` }}
                />
              </div>
              <span className="text-[11px] text-(--color-ink-3) font-mono">
                {name} / {name}-bg
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
