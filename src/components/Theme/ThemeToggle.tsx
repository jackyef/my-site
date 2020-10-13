import * as React from 'react';
import { canUseDOM } from '@/utils/constants';
import { sendEventTracker } from '@/utils/analytics/tracker';

/**
 * @TODO: Support multiple theme, not just light and dark mode.
 */
export const ThemeToggle = () => {
  const [theme, setTheme] = React.useState<string>(
    canUseDOM ? localStorage.getItem('theme') || '' : '',
  );

  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <>
      <button
        className="inline-block ml-2"
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
