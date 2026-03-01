import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dim' | 'dark';

const THEMES: Theme[] = ['light', 'dim', 'dark'];
const STORAGE_KEY = 'theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored && THEMES.includes(stored)) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    setThemeState(getInitialTheme());
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);

    const apply = () => {
      document.documentElement.setAttribute('data-theme', t);
    };

    if (!document.startViewTransition) {
      apply();
    } else {
      document.startViewTransition(apply);
    }
  }, []);

  // Bind for system preference changes
  useEffect(() => {
    (
      window as Window & { __themeBinding?: (t: Theme) => void }
    ).__themeBinding = (t: Theme) => {
      setThemeState(t);
    };
  }, []);

  return { theme, setTheme, themes: THEMES };
}
