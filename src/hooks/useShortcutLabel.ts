import { useEffect, useState } from 'react';

/**
 * Labels a keyboard shortcut for the platform actually running it.
 *
 * The command palette has always accepted both Meta+K and Ctrl+K, but the hint
 * beside the search box said `⌘K` to everyone — so on Windows and Linux the
 * interface was naming a key the keyboard does not have.
 *
 * Starts as the Mac label so the server render and the first client render
 * agree, then corrects itself after mount for anyone else. The platform is
 * unknowable during SSR, and a hint that is wrong for one frame beats one that
 * pops in after hydration.
 *
 * `⌘` needs no separator — the glyph reads as its own token. `Ctrl` does, or
 * it runs into the key it modifies ("CtrlK").
 */
export function useShortcutLabel(key: string): string {
  const [isApple, setIsApple] = useState(true);

  useEffect(() => {
    // userAgentData where it exists, the platform string otherwise. Both can
    // be spoofed; neither matters enough here for that to be a problem.
    const platform =
      (
        navigator as Navigator & {
          userAgentData?: { platform?: string };
        }
      ).userAgentData?.platform ??
      navigator.platform ??
      '';

    setIsApple(/mac|iphone|ipad|ipod/i.test(platform));
  }, []);

  return isApple ? `⌘${key}` : `Ctrl ${key}`;
}
