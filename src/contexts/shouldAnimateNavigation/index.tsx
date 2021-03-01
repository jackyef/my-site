import { useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/router';

import { useReduceMotion } from '@/hooks/useReduceMotion';

let isFirstPageLoad = true;

const ShouldAnimateNavigationContext = createContext(true);

export const ShouldAnimateNavigationProvider: React.FC = ({ children }) => {
  const prefersReducedMotion = useReduceMotion();
  const router = useRouter();
  const shouldAnimateNavigation = !prefersReducedMotion && !isFirstPageLoad;

  useEffect(() => {
    const handleRouteChange = () => {
      if (isFirstPageLoad) {
        isFirstPageLoad = false;
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <ShouldAnimateNavigationContext.Provider value={shouldAnimateNavigation}>
      {children}
    </ShouldAnimateNavigationContext.Provider>
  );
};

export const useShouldAnimateNavigation = () => {
  return useContext(ShouldAnimateNavigationContext);
};
