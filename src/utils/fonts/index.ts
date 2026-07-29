/**
 * ─── Pick the site's type system here ───────────────────────────────────────
 *
 * Change this one import. Everything downstream — Tailwind's font-sans /
 * font-serif / font-mono, the heading rules and the per-pairing optical tuning
 * in globals.css — follows from it. Unimported pairings are tree-shaken, so
 * only the active faces are ever shipped to the browser.
 *
 *   ./pairings/current     Fraunces / Epilogue / JetBrains Mono
 *   ./pairings/refined     Fraunces / Inter Tight / JetBrains Mono
 *   ./pairings/editorial   Newsreader / Public Sans / JetBrains Mono
 *   ./pairings/blueprint   Space Grotesk / Inter Tight / Geist Mono
 *   ./pairings/literary    Instrument Serif / Instrument Sans / JetBrains Mono
 *   ./pairings/warm        Bricolage Grotesque / Public Sans / JetBrains Mono
 */
import { pairing } from './pairings/current';

export const activePairing = pairing;

export const fontsClasses = pairing.className;

/** `data-type-pairing` on <html>; selects the tuning block in globals.css. */
export const fontsPairingId = pairing.id;

export const initFonts = () => fontsClasses;
