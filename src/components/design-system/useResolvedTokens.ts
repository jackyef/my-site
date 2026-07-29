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
 * getPropertyValue, because that makes the browser normalise every token to
 * `rgb(…)` no matter how it was authored.
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
        next[theme][token] = getComputedStyle(probes[i]).color;
      });
    }

    document.body.removeChild(host);
    setResolved(next);
  }, [key]);

  return resolved;
}
