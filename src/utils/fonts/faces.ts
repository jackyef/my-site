import {
  Epilogue,
  Figtree,
  Fraunces,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Inter_Tight,
  JetBrains_Mono,
  Libre_Franklin,
  Public_Sans,
  Source_Sans_3,
} from 'next/font/google';

/**
 * Every face the site can render, declared once.
 *
 * The pairing is switchable at runtime, so all of these have to be in the
 * bundle — but each only defines an @font-face rule. A browser downloads a
 * font file when a rule actually matches, so visitors still fetch just the
 * pairing they're using. Opening the font picker is what pulls in the rest,
 * because it previews each name in its own face.
 *
 * `preload` is therefore reserved for the two faces every first paint needs:
 * Fraunces (in every pairing) and the default text face.
 */

export const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: true,
});

export const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-source-sans',
  display: 'swap',
  preload: true,
});

export const interTight = Inter_Tight({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-inter-tight',
  display: 'swap',
  preload: false,
});

export const publicSans = Public_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-public-sans',
  display: 'swap',
  preload: false,
});

export const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-plex-sans',
  display: 'swap',
  preload: false,
});

export const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-libre-franklin',
  display: 'swap',
  preload: false,
});

export const figtree = Figtree({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-figtree',
  display: 'swap',
  preload: false,
});

// Weights are left unset so next/font serves the variable file — the static
// 300–600 set meant every `font-bold` (700) silently rendered at 600.
export const epilogue = Epilogue({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-epilogue',
  display: 'swap',
  preload: false,
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: false,
});

// Not variable on Google Fonts, so its weights are enumerated.
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
  preload: false,
});

/** Applied to <html>; defines every `--font-*` custom property at once. */
export const fontsClasses = [
  fraunces,
  sourceSans,
  interTight,
  publicSans,
  plexSans,
  libreFranklin,
  figtree,
  epilogue,
  jetbrainsMono,
  plexMono,
]
  .map((f) => f.variable)
  .join(' ');
