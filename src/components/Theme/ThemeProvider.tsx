import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { canUseDOM } from '@/utils/constants';

export type Theme = 'default' | 'dark';

export const ThemeContext = createContext<
  [Theme, Dispatch<SetStateAction<Theme>>]
>(['default', () => {}]);

interface Props {
  children?: React.ReactNode;
}

/**
 * @TODO: Support multiple theme, not just light and dark mode.
 */
export const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState<string>(
    canUseDOM
      ? getComputedStyle(document.body).getPropertyValue('--theme')
      : '',
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // a binding to handle user changing their preferred scheme without reloading page
    window.__themeBinding = (newTheme: Theme) => {
      setTheme(newTheme);
    };
  }, []);

  return (
    <ThemeContext.Provider
      value={[theme as Theme, setTheme as Dispatch<SetStateAction<Theme>>]}
    >
      {children}
    </ThemeContext.Provider>
  );
};
