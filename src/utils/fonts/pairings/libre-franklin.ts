import { JetBrains_Mono, Libre_Franklin } from 'next/font/google';

import { display } from '../display';
import type { FontPairing } from '../types';

const text = Libre_Franklin({
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
  id: 'libre-franklin',
  name: 'Fraunces / Libre Franklin / JetBrains Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
