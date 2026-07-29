import {
  Bricolage_Grotesque,
  JetBrains_Mono,
  Public_Sans,
} from 'next/font/google';

import type { FontPairing } from '../types';

// Bricolage has no true italic — the accented <em> in headings will be a
// synthetic slant.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
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
  id: 'warm',
  name: 'Bricolage Grotesque / Public Sans / JetBrains Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
