import { Theme } from '@/components/Theme/ThemeProvider';

declare global {
  interface Window {
    __themeBinding: (theme: Theme) => void;
    gtag: (...args: any) => void;
  }
}
