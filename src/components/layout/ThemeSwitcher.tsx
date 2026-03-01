import { CircleDot, Moon, Sun } from 'lucide-react';

import { SegmentedControl } from '@/components/common/SegmentedControl';

import { Theme } from '@/hooks/useTheme';

interface ThemeSwitcherProps {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  compact?: boolean;
}

const THEME_OPTIONS: {
  value: Theme;
  label: string;
  icon: React.ReactNode;
}[] = [
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
        className="w-full flex items-center justify-center p-[7px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-active)] text-[var(--color-accent-text)] cursor-pointer font-[inherit] transition-[background,color] duration-[130ms]"
      >
        {currentOption.icon}
      </button>
    );
  }

  return (
    <SegmentedControl
      options={THEME_OPTIONS}
      value={theme}
      onChange={onThemeChange}
      className="w-full"
      labelClassName="hidden lg:inline"
    />
  );
}
