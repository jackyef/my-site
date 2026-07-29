import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from 'next/font/google';

import type { FontPairing } from '../types';

// Instrument Serif ships a single weight — heading hierarchy has to come from
// size rather than weight, which is why the pairing block in globals.css pins
// --type-head-weight to 400 and scales headings up.
const display = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display-face',
  display: 'swap',
});

const text = Instrument_Sans({
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
  id: 'literary',
  name: 'Instrument Serif / Instrument Sans / JetBrains Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
