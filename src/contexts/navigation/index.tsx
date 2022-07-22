import { useEffect, useContext, createContext, useRef } from 'react';
import { useRouter } from 'next/router';

import { useReduceMotion } from '@/hooks/useReduceMotion';

let isFirstPageLoad = true;

const NavigationContext = createContext({
  shouldAnimate: true,
});

interface Props {
  children?: React.ReactNode;
}

export const NavigationProvider = ({ children }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReduceMotion();
  const router = useRouter();
  const shouldAnimate = !prefersReducedMotion && !isFirstPageLoad;

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

  useEffect(() => {
    // Reset the focus when pathname changes
    containerRef.current?.focus();
  }, [router.pathname]);

  return (
    <NavigationContext.Provider value={{ shouldAnimate }}>
      <div ref={containerRef} tabIndex={-1} style={{ outline: 'none' }}>
        {children}
      </div>
    </NavigationContext.Provider>
  );
};

export const useShouldAnimateNavigation = () => {
  const { shouldAnimate } = useContext(NavigationContext);

  return shouldAnimate;
};
