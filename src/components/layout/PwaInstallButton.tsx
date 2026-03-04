import { Download } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { usePwaInstall } from '@/hooks/usePwaInstall';

interface PwaInstallButtonProps {
  variant: 'sidebar' | 'mobile';
}

export function PwaInstallButton({ variant }: PwaInstallButtonProps) {
  const { isReady, trigger } = usePwaInstall();

  if (variant === 'sidebar') {
    return (
      <AnimatePresence>
        {isReady && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => trigger()}
            title="Install PWA"
            aria-label="Install PWA"
            className="flex items-center justify-center text-center gap-2 w-full px-[10px] py-[7px] rounded-lg bg-(--color-accent-xl) border border-(--color-accent-l) text-(--color-accent-text) text-[13px] font-medium cursor-pointer font-[inherit] transition-[background,border-color] duration-[130ms] hover:bg-(--color-accent-l)"
          >
            <Download size={15} aria-hidden="true" className="shrink-0" />
            <span className="hidden lg:block">Install PWA</span>
            {/* Spacer div to achieve better visual balance. */}
            <div className="invisible h-px w-2" />
          </motion.button>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isReady && (
        <motion.button
          initial={{ opacity: 0, scale: 0.85, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.85, x: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => trigger()}
          aria-label="Install app"
          className="fixed bottom-[26px] right-[76px] z-49 flex items-center gap-[6px] px-3 py-[7px] rounded-full bg-(--color-bg-panel) border border-(--color-border) shadow-md text-(--color-accent-text) text-[13px] font-medium cursor-pointer font-[inherit]"
        >
          <Download size={14} aria-hidden="true" />
          <span>Install</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
