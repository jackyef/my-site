import { SearchIcon } from 'lucide-react';

import { useCommandPaletteContext } from '@/components/CommandPalette/hooks/useCommandPaletteContext';

import { useFontPairing } from '@/hooks/useFontPairing';
import { useTheme } from '@/hooks/useTheme';

import { FontSwitcher } from './FontSwitcher';
import { PwaInstallButton } from './PwaInstallButton';
import { SidebarNav } from './SidebarNav';
import { ThemeSwitcher } from './ThemeSwitcher';

function LogoMark() {
  return (
    <div className="flex items-center gap-[9px]">
      <div className="w-[26px] h-[26px] rounded-[7px] bg-(--color-accent) flex items-center justify-center shrink-0">
        <span className="text-white text-[13px] font-bold font-serif leading-none">
          J
        </span>
      </div>
      {/* Hide domain text on narrow (icon-strip) sidebar */}
      <span className="hidden lg:inline font-serif text-[15px] font-semibold text-(--color-ink) tracking-[-0.01em]">
        jackyef.com
      </span>
    </div>
  );
}

export function Sidebar() {
  const { setIsOpen } = useCommandPaletteContext();
  const { theme, setTheme } = useTheme();
  const { pairing, setPairing } = useFontPairing();

  return (
    <aside
      aria-label="Main navigation"
      className="sidebar shrink-0 h-dvh sticky top-0 flex flex-col bg-(--color-bg-sidebar) border-r border-(--color-border) overflow-y-auto overflow-x-hidden md:w-[60px] lg:w-[220px]"
    >
      {/* Top: Logo + CMD trigger */}
      <div className="px-4 pt-[18px] pb-3 border-b border-(--color-border)">
        <LogoMark />

        {/* CMD trigger — hidden on icon-strip sidebar */}
        <button
          onClick={() => setIsOpen(true)}
          className="hidden lg:flex mt-[10px] w-full items-center gap-[6px] px-[10px] py-[6px] rounded-lg border border-(--color-border) bg-(--color-bg) text-(--color-ink-4) text-[13px] cursor-pointer font-[inherit] text-left transition-[border-color,color] duration-[150ms] hover:border-(--color-accent-l) hover:text-(--color-ink-3)"
        >
          <SearchIcon size={13} aria-hidden="true" />
          <span className="flex-1">Quick actions…</span>
          <span className="ml-auto text-[10px] border border-(--color-border) rounded-[4px] px-[5px] py-[1px] text-(--color-ink-4)">
            ⌘K
          </span>
        </button>

        {/* CMD icon button — visible only on icon-strip sidebar */}
        <button
          onClick={() => setIsOpen(true)}
          title="Quick actions (⌘K)"
          aria-label="Quick actions"
          className="flex lg:hidden mt-[10px] w-full items-center justify-center p-[6px] rounded-lg border border-(--color-border) bg-(--color-bg) text-(--color-ink-4) cursor-pointer font-[inherit] transition-[background,border-color] duration-[130ms] hover:bg-(--color-bg-hover) hover:border-(--color-accent-l)"
        >
          <SearchIcon size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Navigation */}
      <SidebarNav />

      {/* Bottom: Theme + Social */}
      <div className="px-2 py-3 border-t border-(--color-border) flex flex-col gap-2">
        <PwaInstallButton variant="sidebar" />
        {/* Compact (icon-strip md–lg) */}
        <div className="md:flex lg:hidden flex-col gap-2">
          <ThemeSwitcher theme={theme} onThemeChange={setTheme} compact />
          <FontSwitcher
            pairing={pairing}
            onPairingChange={setPairing}
            anchor="bottom start"
            className="w-full"
            compact
          />
        </div>
        {/* Full (lg+) — the font picker rides along on the theme row, since
            it's a set-once preference that doesn't deserve a row of its own. */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
          </div>
          <FontSwitcher
            pairing={pairing}
            onPairingChange={setPairing}
            anchor="top end"
            className="shrink-0"
            compact
          />
        </div>
      </div>
    </aside>
  );
}
