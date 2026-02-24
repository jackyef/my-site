export type BPScreen =
  | { id: 'home' }
  | { id: 'blog' }
  | { id: 'post'; slug: string }
  | { id: 'about' };

export type BPSection = 'home' | 'blog' | 'about';

// isActive / setIsActive removed — the page being mounted = active
export interface BPContextValue {
  screenStack: BPScreen[];
  currentScreen: BPScreen;
  push: (screen: BPScreen) => void;
  pop: () => void; // at root → triggers onExit
  hasGamepad: boolean;
}

export interface GamepadButtonState {
  pressed: boolean;
  lastPressedAt: number;
}

export interface GamepadState {
  buttons: GamepadButtonState[];
  axes: number[];
}

export type SplashPhase = 'boot' | 'loading' | 'scanline' | 'done';
