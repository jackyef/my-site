import { useEffect, useState } from 'react';

const QUERY = '(hover: hover) and (pointer: fine)';

/**
 * True when the device drives a precise, hovering pointer (mouse / trackpad).
 *
 * Deliberately false on the server and during the first client render so
 * hydration stays stable — pointer-driven 3D is a progressive enhancement that
 * switches on right after mount, and never runs on touch where there is no
 * hover state to drive it.
 */
export function useFinePointer() {
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const handleChange = () => setFinePointer(mq.matches);

    handleChange();

    mq.addEventListener('change', handleChange);

    return () => {
      mq.removeEventListener('change', handleChange);
    };
  }, []);

  return finePointer;
}
