import { Lora, Plus_Jakarta_Sans } from '@next/font/google';

export const mainFont = Plus_Jakarta_Sans({
  variable: '--main-font',
  display: 'swap',
  subsets: ['latin'],
  preload: true,
  weight: ['400', '700'],
});

export const headingFont = Lora({
  variable: '--heading-font',
  display: 'swap',
  subsets: ['latin'],
  preload: true,
  weight: ['400', '500', '700'],
});

export const fontsClasses = `${mainFont.variable} ${headingFont.variable}`;
export const initFonts = () => fontsClasses;
