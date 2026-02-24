import * as React from 'react';
import { motion } from 'framer-motion';

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
  return (
    <motion.button
      className={cn(
        'bp-focusable',
        'relative text-left',
        'rounded-xl border border-white/10',
        'bg-white/5 backdrop-blur-sm',
        'outline-none',
        'transition-colors duration-150',
        'focus:border-white/30 focus:bg-white/10',
        'focus:ring-2 focus:ring-white/20 focus:ring-offset-0',
        'hover:border-white/20 hover:bg-white/8',
        className,
      )}
      data-bp-row={row}
      onClick={onClick}
      tabIndex={tabIndex}
      whileFocus={prefersReducedMotion ? undefined : { scale: 1.03 }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.15 }}
      style={style}
    >
      {children}
    </motion.button>
  );
};
