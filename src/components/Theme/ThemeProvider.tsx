import { createContext, Dispatch, SetStateAction, useState } from 'react';

import { canUseDOM } from '@/utils/constants';

// Legacy theme types — kept for backwards compatibility with existing components
export const THEMES = ['default', 'dark', 'cobalt', 'purple-and-gold'] as const;
export type Theme = typeof THEMES[number];

export const ThemeContext = createContext<
  [Theme, Dispatch<SetStateAction<Theme>>]
>(['default', () => {}]);

interface Props {
  children?: React.ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState<Theme>(
    canUseDOM
      ? (getComputedStyle(document.body)
          .getPropertyValue('--theme')
          .trim() as Theme)
      : 'default',
  );

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};
