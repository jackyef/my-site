import { createContext, useCallback, useState } from 'react';

import type { BPContextValue, BPScreen } from './types';
import { useGamepad } from './hooks/useGamepad';

const HOME_SCREEN: BPScreen = { id: 'home' };

export const BigPictureContext = createContext<BPContextValue>({
  screenStack: [HOME_SCREEN],
  currentScreen: HOME_SCREEN,
  push: () => {},
  pop: () => {},
  hasGamepad: false,
});

interface Props {
  children?: React.ReactNode;
  onExit: () => void;
}

export const BigPictureProvider = ({ children, onExit }: Props) => {
  const [screenStack, setScreenStack] = useState<BPScreen[]>([HOME_SCREEN]);

  const push = useCallback((screen: BPScreen) => {
    setScreenStack((prev) => [...prev, screen]);
  }, []);

  const pop = useCallback(() => {
    setScreenStack((prev) => {
      if (prev.length <= 1) {
        onExit();
        return [HOME_SCREEN];
      }
      return prev.slice(0, -1);
    });
  }, [onExit]);

  const currentScreen = screenStack[screenStack.length - 1] ?? HOME_SCREEN;

  // Track gamepad connection state for UI hints (no polling here)
  const { hasGamepad } = useGamepad({ isActive: false });

  const value: BPContextValue = {
    screenStack,
    currentScreen,
    push,
    pop,
    hasGamepad,
  };

  return (
    <BigPictureContext.Provider value={value}>
      {children}
    </BigPictureContext.Provider>
  );
};
