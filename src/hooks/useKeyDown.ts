import { useEffect } from 'react';

type SpecialKeys = Partial<
  Pick<KeyboardEvent, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>
>;

export const useKeyDown = (
  key: KeyboardEvent['key'],
  callback: () => void,
  specialKeys?: SpecialKeys,
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        if (specialKeys) {
          if (specialKeys.ctrlKey && !event.ctrlKey) return;
          if (specialKeys.altKey && !event.altKey) return;
          if (specialKeys.shiftKey && !event.shiftKey) return;
          if (specialKeys.metaKey && !event.metaKey) return;
        }
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback, key, specialKeys]);
};
