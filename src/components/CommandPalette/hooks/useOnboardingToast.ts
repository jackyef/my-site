import { useCallback, useEffect } from 'react';

import { toast } from '@/lib/toast';

import { getPlatformMetaKey } from '@/utils/keyboard';

let hasOpenedBefore = false;

export const useOnboardingToast = () => {
  useEffect(() => {
    if (localStorage.getItem('cmd_k_opened_before') === 'true') {
      hasOpenedBefore = true;
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const isProbablyTouchDevice =
        window.matchMedia('(pointer: coarse)').matches;

      if (!hasOpenedBefore && !isProbablyTouchDevice) {
        const metaKey = getPlatformMetaKey();

        toast({ text: `Pssst! Try pressing ${metaKey}+K 🤫` });
      }
    }, 6000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const onFirstTimeOpen = useCallback(() => {
    if (!hasOpenedBefore) {
      hasOpenedBefore = true;
      localStorage.setItem('cmd_k_opened_before', 'true');
    }
  }, []);

  return {
    onFirstTimeOpen,
    hasOpenedBefore,
  };
};
