import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';

import { display } from '../display';
import type { FontPairing } from '../types';

const text = IBM_Plex_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-text-face',
  display: 'swap',
});

// The one pairing whose prose and code share a superfamily. Plex Mono is not
// variable on Google Fonts, so its weights are enumerated.
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono-face',
  display: 'swap',
});

export const pairing: FontPairing = {
  id: 'plex',
  name: 'Fraunces / IBM Plex Sans / IBM Plex Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
