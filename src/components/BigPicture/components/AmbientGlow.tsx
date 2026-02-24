import { motion } from 'framer-motion';

import { SECTION_GLOW_COLORS } from '../constants';
import type { BPScreen } from '../types';

interface Props {
  currentScreen: BPScreen;
  prefersReducedMotion: boolean;
}

export const AmbientGlow = ({ currentScreen, prefersReducedMotion }: Props) => {
  const background =
    SECTION_GLOW_COLORS[currentScreen.id] ?? SECTION_GLOW_COLORS.home;

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      animate={{ background }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.8, ease: 'easeInOut' }
      }
    />
  );
};
