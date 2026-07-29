/**
 * A type system for the site: a display face, a text face and a mono face.
 *
 * Each pairing module exposes the three faces under stable CSS variables
 * (`--font-display-face`, `--font-text-face`, `--font-mono-face`) so the rest
 * of the stylesheet never names a font directly. Swapping pairings is then a
 * single import change in `./index`.
 */
export type PairingId =
  | 'current'
  | 'refined'
  | 'editorial'
  | 'blueprint'
  | 'literary'
  | 'warm';

export interface FontPairing {
  id: PairingId;
  /** `display / text / mono`, for readability at the call site. */
  name: string;
  /** next/font classNames, applied to <html>. */
  className: string;
}
