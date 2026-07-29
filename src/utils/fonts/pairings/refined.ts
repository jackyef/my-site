import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';

import type { FontPairing } from '../types';

const display = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-display-face',
  display: 'swap',
});

const text = Inter_Tight({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-text-face',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-face',
  display: 'swap',
});

export const pairing: FontPairing = {
  id: 'refined',
  name: 'Fraunces / Inter Tight / JetBrains Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
