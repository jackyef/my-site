import { AnimatePresence, motion } from 'framer-motion';
import {
  CircleDot,
  FlaskConical,
  Home,
  Menu,
  Moon,
  Palette,
  PenLine,
  Sun,
  User,
  Wrench,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Theme, useTheme } from '@/hooks/useTheme';

const NAV_LINKS = [
  {
    href: '/',
    label: 'Home',
    icon: <Home size={16} aria-hidden="true" />,
    exact: true,
  },
  {
    href: '/about',
    label: 'About',
    icon: <User size={16} aria-hidden="true" />,
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: <PenLine size={16} aria-hidden="true" />,
  },
  {
    href: '/uses',
    label: 'Uses',
    icon: <Wrench size={16} aria-hidden="true" />,
  },
];

const TOOL_LINKS = [
  {
    href: '/tools/playground',
    label: 'Playground',
    icon: <FlaskConical size={16} aria-hidden="true" />,
  },
  {
    href: '/tools/claymorphism',
    label: 'Claymorphism',
    icon: <Palette size={16} aria-hidden="true" />,
  },
];

const THEME_OPTS: { value: Theme; icon: React.ReactNode; label: string }[] = [
  {
    value: 'light',
    icon: <Sun size={13} aria-hidden="true" />,
    label: 'Light',
  },
  {
    value: 'dim',
    icon: <Moon size={13} aria-hidden="true" />,
    label: 'Dim',
  },
  {
    value: 'dark',
    icon: <CircleDot size={13} aria-hidden="true" />,
    label: 'Dark',
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
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
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(2px)',
              zIndex: 48,
            }}
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
            style={{
              position: 'fixed',
              bottom: 88,
              right: 20,
              background: 'var(--color-bg-panel)',
              border: '1px solid var(--color-border)',
              borderRadius: 16,
              boxShadow: 'var(--shadow-lg)',
              zIndex: 49,
              minWidth: 200,
              overflow: 'hidden',
              transformOrigin: 'bottom right',
            }}
          >
            {/* Nav links */}
            <div style={{ paddingTop: 6, paddingBottom: 6 }}>
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href, link.exact);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 18px',
                      fontSize: 14,
                      fontWeight: active ? 600 : 400,
                      color: active
                        ? 'var(--color-accent-text)'
                        : 'var(--color-ink-2)',
                      textDecoration: 'none',
                      background: active
                        ? 'var(--color-bg-active)'
                        : 'transparent',
                    }}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Tools section */}
            <div style={{ height: 1, background: 'var(--color-border)' }} />
            <div
              style={{
                padding: '4px 18px 2px',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-4)',
              }}
            >
              Tools
            </div>
            <div style={{ paddingBottom: 4 }}>
              {TOOL_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 18px',
                      fontSize: 14,
                      fontWeight: active ? 600 : 400,
                      color: active
                        ? 'var(--color-accent-text)'
                        : 'var(--color-ink-2)',
                      textDecoration: 'none',
                      background: active
                        ? 'var(--color-bg-active)'
                        : 'transparent',
                    }}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Separator */}
            <div style={{ height: 1, background: 'var(--color-border)' }} />

            {/* Theme row */}
            <div
              style={{
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--color-ink-3)' }}>
                Theme
              </span>
              <div
                style={{
                  display: 'flex',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  background: 'var(--color-bg)',
                }}
              >
                {THEME_OPTS.map(({ value, icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    title={label}
                    aria-label={`Switch to ${label} theme`}
                    aria-pressed={theme === value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '5px 10px',
                      color:
                        theme === value
                          ? 'var(--color-accent-text)'
                          : 'var(--color-ink-4)',
                      background:
                        theme === value
                          ? 'var(--color-bg-active)'
                          : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'background 0.13s, color 0.13s',
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        title={open ? 'Close menu' : 'Open menu'}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 20,
          zIndex: 50,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--color-accent)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)',
          fontFamily: 'inherit',
        }}
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
              <X size={20} aria-hidden="true" />
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
              <Menu size={20} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
