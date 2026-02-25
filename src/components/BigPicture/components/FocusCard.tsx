import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

import { cn } from '@/utils/styles/classNames';

interface Props {
  children: React.ReactNode;
  className?: string;
  row?: string;
  onClick?: () => void;
  tabIndex?: number;
  prefersReducedMotion?: boolean;
  style?: React.CSSProperties;
}

export const FocusCard = ({
  children,
  className,
  row,
  onClick,
  tabIndex = 0,
  prefersReducedMotion = false,
  style,
}: Props) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const spotlightBg = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.065), transparent 80%)`;

  return (
    <motion.button
      className={cn(
        'bp-focusable',
        'relative text-left overflow-hidden',
        'rounded-2xl border border-white/10',
        'bg-white/5 backdrop-blur-sm',
        'outline-none',
        'focus:border-white/50 focus:bg-white/10',
        'focus:shadow-[0_0_0_3px_rgba(255,255,255,0.18),0_0_32px_rgba(255,255,255,0.06)]',
        className,
      )}
      data-bp-row={row}
      onClick={onClick}
      tabIndex={tabIndex}
      onMouseMove={
        prefersReducedMotion
          ? undefined
          : (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              mouseX.set(e.clientX - rect.left);
              mouseY.set(e.clientY - rect.top);
            }
      }
      onMouseEnter={() => !prefersReducedMotion && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileFocus={prefersReducedMotion ? undefined : { scale: 1.05 }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
      style={style}
    >
      {/* Mouse-tracking spotlight — uses motion values, no re-renders */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ background: spotlightBg }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
      {children}
    </motion.button>
  );
};
