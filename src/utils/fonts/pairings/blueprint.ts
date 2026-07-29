import { Geist_Mono, Inter_Tight, Space_Grotesk } from 'next/font/google';

import type { FontPairing } from '../types';

// Space Grotesk has no true italic — the accented <em> in headings will be a
// synthetic slant.
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display-face',
  display: 'swap',
});

const text = Inter_Tight({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-text-face',
  display: 'swap',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono-face',
  display: 'swap',
});

export const pairing: FontPairing = {
  id: 'blueprint',
  name: 'Space Grotesk / Inter Tight / Geist Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
