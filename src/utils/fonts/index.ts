/**
 * The site's type system.
 *
 * Fraunces is fixed as the display face; the text face is switchable at
 * runtime via the font picker in the sidebar. See ./pairings for the options
 * and ./faces for the underlying next/font declarations.
 *
 * To change the default for new visitors, change DEFAULT_PAIRING_ID in
 * ./pairings and the matching values in the `:root` block of globals.css.
 */
export { fontsClasses } from './faces';

export {
  DEFAULT_PAIRING_ID,
  FONT_PAIRINGS,
  PAIRING_IDS,
  getPairing,
  isPairingId,
} from './pairings';

export type { FontPairing, PairingId } from './pairings';

/** localStorage key holding the visitor's chosen pairing. */
export const FONT_STORAGE_KEY = 'font';

/** Attribute on <html> that selects the pairing's CSS block. */
export const FONT_ATTRIBUTE = 'data-type-pairing';
