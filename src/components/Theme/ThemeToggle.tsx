import * as React from 'react';
import { sendEventTracker } from '@/utils/analytics/tracker';
import { ThemeContext } from './ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useContext(ThemeContext);

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
