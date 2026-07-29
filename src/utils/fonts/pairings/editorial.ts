import { JetBrains_Mono, Newsreader, Public_Sans } from 'next/font/google';

import type { FontPairing } from '../types';

const display = Newsreader({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-display-face',
  display: 'swap',
});

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
  id: 'editorial',
  name: 'Newsreader / Public Sans / JetBrains Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
