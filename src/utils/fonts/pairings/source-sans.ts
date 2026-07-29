import { JetBrains_Mono, Source_Sans_3 } from 'next/font/google';

import { display } from '../display';
import type { FontPairing } from '../types';

const text = Source_Sans_3({
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
  id: 'source-sans',
  name: 'Fraunces / Source Sans 3 / JetBrains Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
