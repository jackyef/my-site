import { Fraunces } from 'next/font/google';

/**
 * The display face, fixed across every pairing — Fraunces carries the site's
 * voice. Only the text face (and its mono partner) varies between pairings.
 *
 * The opsz axis is what makes it work at both hero and post-title sizes; the
 * italic is what `<em>` inside a heading leans on for the accent colour.
 */
export const display = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-display-face',
  display: 'swap',
});
