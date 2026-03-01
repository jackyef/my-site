import { CircleDot, Moon, Sun } from 'lucide-react';

import { Theme } from '@/hooks/useTheme';

interface ThemeSwitcherProps {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  compact?: boolean;
}

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] =
  [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun size={13} aria-hidden="true" />,
    },
    {
      value: 'dim',
      label: 'Dim',
      icon: <Moon size={13} aria-hidden="true" />,
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <CircleDot size={13} aria-hidden="true" />,
    },
  ];

const THEME_ORDER: Theme[] = ['light', 'dim', 'dark'];

export function ThemeSwitcher({
  theme,
  onThemeChange,
  compact,
}: ThemeSwitcherProps) {
  if (compact) {
    const currentOption =
      THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[0];
    const cycleTheme = () => {
      const next =
        THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length];
      onThemeChange(next);
    };
    return (
      <button
        onClick={cycleTheme}
        title="Cycle theme"
        aria-label={`Current theme: ${theme}. Click to cycle.`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '7px',
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          background: 'var(--color-bg-active)',
          color: 'var(--color-accent-text)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'background 0.13s, color 0.13s',
        }}
      >
        {currentOption.icon}
      </button>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}
    >
      {THEME_OPTIONS.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onThemeChange(value)}
          title={label}
          aria-label={`Switch to ${label} theme`}
          aria-pressed={theme === value}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            padding: '5px 2px',
            fontSize: 11,
            fontWeight: 500,
            color:
              theme === value
                ? 'var(--color-accent-text)'
                : 'var(--color-ink-4)',
            background:
              theme === value ? 'var(--color-bg-active)' : 'transparent',
            borderRight: '1px solid var(--color-border)',
            transition: 'background 0.13s, color 0.13s',
            cursor: 'pointer',
            border: 'none',
            fontFamily: 'inherit',
          }}
        >
          {icon}
          {/* Label hidden on icon-strip sidebar */}
          <span className="hidden lg:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
