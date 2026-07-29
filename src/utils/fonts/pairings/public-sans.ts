import { JetBrains_Mono, Public_Sans } from 'next/font/google';

import { display } from '../display';
import type { FontPairing } from '../types';

const text = Public_Sans({
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
  id: 'public-sans',
  name: 'Fraunces / Public Sans / JetBrains Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
