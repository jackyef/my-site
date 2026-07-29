import { AnimatePresence, motion } from 'motion/react';
import {
  CircleDotIcon,
  HomeIcon,
  MenuIcon,
  MoonIcon,
  PenLineIcon,
  SunIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { SegmentedControl } from '@/components/common/SegmentedControl';
import { Surface } from '@/components/common/Surface';

import { useFontPairing } from '@/hooks/useFontPairing';
import { Theme, useTheme } from '@/hooks/useTheme';

import { cn } from '@/utils/styles/classNames';

import { FontSwitcher } from './FontSwitcher';

const NAV_LINKS = [
  {
    href: '/',
    label: 'Home',
    icon: <HomeIcon size={16} aria-hidden="true" />,
    exact: true,
  },
  {
    href: '/about',
    label: 'About',
    icon: <UserIcon size={16} aria-hidden="true" />,
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: <PenLineIcon size={16} aria-hidden="true" />,
  },
];

const THEME_OPTS: { value: Theme; icon: React.ReactNode; label: string }[] = [
  {
    value: 'light',
    icon: <SunIcon size={13} aria-hidden="true" />,
    label: 'Light',
  },
  {
    value: 'dim',
    icon: <MoonIcon size={13} aria-hidden="true" />,
    label: 'Dim',
  },
  {
    value: 'dark',
    icon: <CircleDotIcon size={13} aria-hidden="true" />,
    label: 'Dark',
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { pairing, setPairing } = useFontPairing();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return router.pathname === href;
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[48]"
          />
        )}
      </AnimatePresence>

      {/* Nav card */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav-card"
            initial={{ opacity: 0, scale: 0.9, rotate: -3, y: 16 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: -3, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed right-5 z-49 min-w-50"
            style={{
              bottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
              transformOrigin: 'bottom right',
            }}
          >
            <Surface elevation="lg" rounded="xl" className="overflow-hidden">
              {/* Nav links */}
              <div>
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href, link.exact);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-5 py-3 text-[14px] no-underline',
                        active
                          ? 'font-semibold text-(--color-accent-text) bg-(--color-bg-active)'
                          : 'font-normal text-(--color-ink-2) bg-transparent',
                      )}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Theme + reading font */}
              <div className="px-4 py-3 flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <SegmentedControl
                    options={THEME_OPTS}
                    value={theme}
                    onChange={setTheme}
                  />
                </div>
                <FontSwitcher
                  pairing={pairing}
                  onPairingChange={setPairing}
                  anchor="bottom end"
                  className="shrink-0"
                  compact
                />
              </div>
            </Surface>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        title={open ? 'Close menu' : 'Open menu'}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        whileTap={{ scale: 0.92 }}
        className="fixed right-5 z-50 w-[52px] h-[52px] rounded-full bg-(--color-accent) text-white border-none cursor-pointer flex items-center justify-center shadow-(--shadow-md) font-[inherit]"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex' }}
            >
              <XIcon size={20} aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex' }}
            >
              <MenuIcon size={20} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
