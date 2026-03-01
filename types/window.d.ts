import type { Theme } from '@/hooks/useTheme';

declare global {
  interface Window {
    __themeBinding: (theme: Theme) => void;
    gtag: (...args: any) => void;
  }
}
