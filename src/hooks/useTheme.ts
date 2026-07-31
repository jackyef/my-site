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

    const root = document.documentElement;

    // Flip the theme with per-element colour transitions suppressed. The
    // shell's surfaces each carry a 0.22s colour transition, which would
    // otherwise run *underneath* the view transition's cross-fade — the same
    // change animated twice, at two different speeds.
    const apply = () => {
      root.setAttribute('data-theme-swapping', '');
      root.setAttribute('data-theme', t);
    };

    const release = () => root.removeAttribute('data-theme-swapping');

    // A cross-fade is motion, and the guidance makes no exception for opacity.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      apply();
      // Two frames: one for the new colours to paint, one before transitions
      // are allowed to observe a change again.
      requestAnimationFrame(() => requestAnimationFrame(release));
      return;
    }

    const transition = document.startViewTransition(apply);
    transition.finished.then(release, release);
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
