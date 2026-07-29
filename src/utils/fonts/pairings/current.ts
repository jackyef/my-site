import { Epilogue, Fraunces, JetBrains_Mono } from 'next/font/google';

import type { FontPairing } from '../types';

// Fraunces is a variable font with opsz axis support
const display = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-display-face',
  display: 'swap',
});

// Weights are left unset so next/font serves the variable file — the static
// 300–600 set meant every `font-bold` (700) silently rendered at 600.
const text = Epilogue({
  subsets: ['latin'],
  variable: '--font-text-face',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-face',
  display: 'swap',
});

export const pairing: FontPairing = {
  id: 'current',
  name: 'Fraunces / Epilogue / JetBrains Mono',
  className: `${display.variable} ${text.variable} ${mono.variable}`,
};
