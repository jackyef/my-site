/**
 * ─── Pick the site's text face here ─────────────────────────────────────────
 *
 * Fraunces is fixed (see ./display); the text face is the variable. Change
 * this one import and everything follows — Tailwind's font-sans / font-serif /
 * font-mono, and the optically matched body size in globals.css. Unimported
 * pairings are tree-shaken, so only the active faces reach the browser.
 *
 * Sizes below are optically matched, not nominally matched: each face was
 * measured for x-height and sized to read at the same apparent scale as
 * Epilogue at 15px.
 *
 *   ./pairings/current          Epilogue        15px    what ships today
 *   ./pairings/inter-tight      Inter Tight     15px    neutral workhorse
 *   ./pairings/public-sans      Public Sans     15.5px  open, faintly humanist
 *   ./pairings/source-sans      Source Sans 3   16.5px  a true text face
 *   ./pairings/plex             IBM Plex Sans   15.5px  matching mono
 *   ./pairings/libre-franklin   Libre Franklin  15.5px  editorial authority
 *   ./pairings/figtree          Figtree         16px    warm geometric
 */
import { pairing } from './pairings/current';

export const activePairing = pairing;

export const fontsClasses = pairing.className;

/** `data-type-pairing` on <html>; selects the tuning block in globals.css. */
export const fontsPairingId = pairing.id;

export const initFonts = () => fontsClasses;
