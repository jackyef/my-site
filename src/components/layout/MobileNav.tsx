import { AnimatePresence, motion } from 'motion/react';
import {
  CircleDotIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { SectionLabel } from '@/components/common/SectionLabel';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { Surface } from '@/components/common/Surface';

import { useFontPairing } from '@/hooks/useFontPairing';
import { Theme, useTheme } from '@/hooks/useTheme';

import { cn } from '@/utils/styles/classNames';

import { FontSwitcher } from './FontSwitcher';
import {
  PAGE_LINKS,
  TOOL_LINKS,
  isNavItemActive,
  type NavItem,
} from './navigation';

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
  const fabRef = useRef<HTMLButtonElement>(null);

  // An overlay you can open with a tap but only close with one is a trap for
  // anyone driving this from a keyboard. Escape dismisses, and focus goes back
  // to the button that opened it rather than to the top of the document.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      fabRef.current?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const renderLink = (item: NavItem) => {
    const active = isNavItemActive(item, router.pathname);
    const { Icon } = item;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center gap-3 px-5 py-3 text-[14px] no-underline',
          // The same three signals the desktop sidebar uses for the same list —
          // wash, weight, accent. A rule down the leading edge was tried here
          // and taken out again: this card draws a border, and a bar at the
          // row's `left: 0` starts *inside* it, so the active row showed a 1px
          // line of border colour pinched between the backdrop and the accent.
          // Nudging the bar inwards would have hidden that, but the sidebar
          // marks the same rows without one, and two navigations over one list
          // should not disagree about what "active" looks like.
          active
            ? 'font-semibold text-(--color-accent-text) bg-(--color-bg-active)'
            : 'font-normal text-(--color-ink-2) bg-transparent',
        )}
      >
        <Icon size={16} aria-hidden="true" />
        {item.label}
      </Link>
    );
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
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-(--z-chrome-backdrop)"
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
            className="fixed right-5 z-(--z-chrome-panel) min-w-50"
            style={{
              bottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
              transformOrigin: 'bottom right',
            }}
          >
            {/* The FAB is domed — lit along the top, casting below. The card it
                opens was still a flat rectangle with a blur under it, so the
                two sat in different rooms. --panel-fill gives the card the
                same directional lighting. */}
            <Surface
              elevation="lg"
              rounded="xl"
              className="overflow-hidden [background-image:var(--panel-fill)]"
            >
              {/* Nav links. Both groups render here — the drawer used to carry
                  only the pages, which left /design and /experiments with no
                  route on a phone at all. */}
              <nav aria-label="Site">
                {PAGE_LINKS.map(renderLink)}

                <SectionLabel className="px-5 pt-3 pb-1">Misc</SectionLabel>
                {TOOL_LINKS.map(renderLink)}
              </nav>

              {/* Theme + reading font. Sunk into a tray rather than floated on
                  the card: the segmented control is a recessed well, and a well
                  cut straight out of a lit surface with nothing around it has
                  no ground to sit on. The tray also puts the controls on their
                  own plane, away from the routes. px-5 so the control's left
                  edge lands on the same line as the link icons above it.

                  One separator, not two: the tokens arrange it so the fill and
                  the hairline are never both visible. Drawing both made two
                  edges out of one, which on a card that also had a border and
                  a ring around it left the bottom of this panel looking like a
                  stack of boxes. */}
              <div className="border-t border-(--panel-tray-edge) bg-(--panel-tray) px-5 py-3 flex items-center gap-2">
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
        ref={fabRef}
        onClick={() => setOpen((prev) => !prev)}
        title={open ? 'Close menu' : 'Open menu'}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        whileTap={{ scale: 0.96 }}
        className="fixed right-5 z-(--z-chrome-fab) w-[52px] h-[52px] rounded-full bg-(--color-accent) [background-image:var(--fab-fill)] text-(--color-on-accent) border-none cursor-pointer flex items-center justify-center shadow-(--shadow-fab) font-[inherit]"
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
