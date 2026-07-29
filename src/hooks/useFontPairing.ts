import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import {
  DEFAULT_PAIRING_ID,
  FONT_ATTRIBUTE,
  FONT_STORAGE_KEY,
  isPairingId,
  type PairingId,
} from '@/utils/fonts';

function getPairingFromDOM(): PairingId {
  const attr = document.documentElement.getAttribute(FONT_ATTRIBUTE);
  return isPairingId(attr) ? attr : DEFAULT_PAIRING_ID;
}

function subscribe(callback: () => void) {
  // Watch for data-type-pairing changes on <html>
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [FONT_ATTRIBUTE],
  });
  return () => observer.disconnect();
}

function getSnapshot(): PairingId {
  return getPairingFromDOM();
}

function getServerSnapshot(): PairingId {
  return DEFAULT_PAIRING_ID;
}

export function useFontPairing() {
  const resolved = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null before mount to avoid hydration mismatch
  const pairing = mounted ? resolved : null;

  const setPairing = useCallback((id: PairingId) => {
    localStorage.setItem(FONT_STORAGE_KEY, id);

    const apply = () => {
      document.documentElement.setAttribute(FONT_ATTRIBUTE, id);
    };

    if (!document.startViewTransition) {
      apply();
    } else {
      document.startViewTransition(apply);
    }
  }, []);

  return { pairing, setPairing, mounted };
}
