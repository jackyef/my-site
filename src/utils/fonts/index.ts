import { Fraunces, Inter } from '@next/font/google';

// Fraunces is a variable font with opsz axis support
export const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const fontsClasses = `${fraunces.variable} ${inter.variable}`;
export const initFonts = () => fontsClasses;
