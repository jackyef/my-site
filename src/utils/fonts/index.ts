import { Epilogue, Fraunces } from 'next/font/google';

// Fraunces is a variable font with opsz axis support
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const sans = Epilogue({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-epilogue',
  display: 'swap',
});

export const fontsClasses = `${fraunces.variable} ${sans.variable}`;
export const initFonts = () => fontsClasses;
