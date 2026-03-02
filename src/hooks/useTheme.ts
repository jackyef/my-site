import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dim' | 'dark';

const THEMES: Theme[] = ['light', 'dim', 'dark'];
const STORAGE_KEY = 'theme';

function getThemeFromDOM(): Theme {
  const attr = document.documentElement.getAttribute(
    'data-theme',
  ) as Theme | null;
  if (attr && THEMES.includes(attr)) return attr;
  return 'light';
}

function subscribe(callback: () => void) {
  // Watch for data-theme changes on <html>
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return getThemeFromDOM();
}

function getServerSnapshot(): Theme {
  return 'light';
}

export function useTheme() {
  const resolvedTheme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null before mount to avoid hydration mismatch
  const theme = mounted ? resolvedTheme : null;

  const setTheme = useCallback((t: Theme) => {
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
      setTheme(t);
    };
  }, [setTheme]);

  return { theme, setTheme, themes: THEMES, mounted };
}
