/**
 * Colour maths for the design system page.
 *
 * Everything here works on the `rgb(…)` strings the browser hands back from
 * getComputedStyle, so the page measures the tokens as they actually resolve
 * rather than re-parsing the hex literals in globals.css.
 */

export type Rgb = [number, number, number];

/** Parses any `rgb(…)` / `rgba(…)` string the browser produces. */
export function parseRgb(value: string): Rgb | null {
  const parts = value.match(/-?[\d.]+/g);
  if (!parts || parts.length < 3) return null;

  return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
}

export function toHex(value: string): string {
  const rgb = parseRgb(value);
  if (!rgb) return value;

  return `#${rgb
    .map((c) => Math.round(c).toString(16).padStart(2, '0'))
    .join('')}`;
}

function toLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.1 relative luminance. */
export function luminance([r, g, b]: Rgb): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** WCAG 2.1 contrast ratio, 1–21. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];

  return (hi + 0.05) / (lo + 0.05);
}

export type ContrastGrade = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/**
 * Grades a ratio against the WCAG thresholds for body text. "AA Large" is the
 * 3:1 floor that applies to 18pt+ / 14pt-bold text and to UI boundaries — it is
 * a pass for headings and borders, not for body copy.
 */
export function gradeContrast(ratio: number): ContrastGrade {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

// Text from the -text tokens, borders from the plain ones. A grid whose whole
// job is measuring contrast was setting these 9px badges in the fill colours —
// "AAA" itself measured 2.13:1, which the grid would have failed had it been
// pointed at itself.
export const GRADE_STYLES: Record<ContrastGrade, string> = {
  AAA: 'text-(--color-success-text) border-(--color-success)',
  AA: 'text-(--color-success-text) border-(--color-success)',
  'AA Large': 'text-(--color-warning-text) border-(--color-warning)',
  // A failure reads as a failure. The ink-4 row goes red on purpose — it is
  // genuinely below the floor, which is exactly why nothing that has to be
  // read on its own is allowed to use it.
  Fail: 'text-(--color-danger-text) border-(--color-danger)',
};
