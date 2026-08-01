import { useEffect, useState } from 'react';

import { THEMES, type ThemeName } from './constants';

export type ResolvedTokens = Record<ThemeName, Record<string, string>>;

const EMPTY: ResolvedTokens = { light: {}, dim: {}, dark: {} };

/**
 * Resolves each token in all three themes at once.
 *
 * The theme blocks in globals.css are plain `[data-theme='…']` selectors, so a
 * detached-looking `<div data-theme="dark">` redeclares the whole palette for
 * its own subtree. Probing inside one of those per theme gets us dark's values
 * while the visitor is still sitting in light — which is what lets the swatches
 * show all three themes side by side, and what lets the contrast grid grade a
 * theme nobody is currently looking at.
 *
 * Colours are read back off a probe's `color` property rather than through
 * getPropertyValue, so what gets measured is the resolved value rather than
 * the literal text of the declaration.
 *
 * That resolved value is then painted to a canvas and read back as bytes.
 * getComputedStyle preserves the authored colour space — the tokens are
 * oklch, so it hands back `oklch(…)` — and everything downstream of this hook
 * (the swatch captions, `parseRgb`, the contrast grid) speaks `rgb(…)`. Left
 * alone, a grid whose whole job is measuring contrast would have read L, C and
 * H as if they were R, G and B and reported confident nonsense.
 */
export function useResolvedTokens(tokens: readonly string[]): ResolvedTokens {
  const [resolved, setResolved] = useState<ResolvedTokens>(EMPTY);
  // Tokens are module-level constants; join to a stable dependency anyway so a
  // caller passing an inline array does not re-probe on every render.
  const key = tokens.join(',');

  useEffect(() => {
    const list = key.split(',');

    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText =
      'position:absolute;left:-9999px;top:0;width:0;height:0;overflow:hidden';
    document.body.appendChild(host);

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const toRgbString = (value: string) => {
      if (!ctx) return value;
      ctx.clearRect(0, 0, 1, 1);
      // Reset first: an unparseable value leaves fillStyle at its previous
      // colour rather than throwing, which would silently reuse the last token.
      ctx.fillStyle = '#000';
      ctx.fillStyle = value;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return `rgb(${r}, ${g}, ${b})`;
    };

    const next = {} as ResolvedTokens;

    for (const theme of THEMES) {
      const scope = document.createElement('div');
      scope.setAttribute('data-theme', theme);
      host.appendChild(scope);

      const probes = list.map((token) => {
        const probe = document.createElement('span');
        probe.style.color = `var(${token})`;
        scope.appendChild(probe);
        return probe;
      });

      next[theme] = {};
      list.forEach((token, i) => {
        next[theme][token] = toRgbString(getComputedStyle(probes[i]).color);
      });
    }

    document.body.removeChild(host);
    setResolved(next);
  }, [key]);

  return resolved;
}
