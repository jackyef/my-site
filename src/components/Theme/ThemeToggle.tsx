import * as React from 'react';
import { canUseDOM } from '@/utils/constants';
import { sendEventTracker } from '@/utils/analytics/tracker';

/**
 * @TODO: Support multiple theme, not just light and dark mode.
 */
export const ThemeToggle = () => {
  const [theme, setTheme] = React.useState<string>(
    canUseDOM
      ? getComputedStyle(document.body).getPropertyValue('--theme')
      : '',
  );

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  React.useEffect(() => {
    // a binding to handle user changing their preferred scheme without reloading page
    // @ts-expect-error
    window.__themeBinding = (newTheme: 'dark' | 'default') => {
      console.log('called', newTheme);
      setTheme(newTheme);
    };
  }, []);

  return (
    <>
      <button
        className="inline-block ml-2 p-2"
        onClick={() => {
          const newTheme = theme !== 'dark' ? 'dark' : 'default';

          setTheme(newTheme);

          sendEventTracker({
            name: 'click',
            category: `header nav`,
            label: `set theme to ${newTheme}`,
          });
        }}
      >
        {theme !== 'dark' ? '☀️' : '🌙'}
      </button>
    </>
  );
};
