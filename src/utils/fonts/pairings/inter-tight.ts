import { Inter_Tight, JetBrains_Mono } from 'next/font/google';

import { display } from '../display';
import type { FontPairing } from '../types';

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
  id: 'inter-tight',
  name: 'Fraunces / Inter Tight / JetBrains Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
