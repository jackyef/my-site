import { Search } from 'lucide-react';

import { useCommandPaletteContext } from '@/components/CommandPalette/hooks/useCommandPaletteContext';

import { useTheme } from '@/hooks/useTheme';

import { SidebarNav } from './SidebarNav';
import { SocialLinks } from './SocialLinks';
import { ThemeSwitcher } from './ThemeSwitcher';

function LogoMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'var(--font-serif)',
            lineHeight: 1,
          }}
        >
          J
        </span>
      </div>
      {/* Hide domain text on narrow (icon-strip) sidebar */}
      <span
        className="hidden lg:inline"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--color-ink)',
          letterSpacing: '-0.01em',
        }}
      >
        jackyef.com
      </span>
    </div>
  );
}

export function Sidebar() {
  const { setIsOpen } = useCommandPaletteContext();
  const { theme, setTheme } = useTheme();

  return (
    <aside
      className="sidebar md:w-[60px] lg:w-[220px]"
      style={{
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-sidebar)',
        borderRight: '1px solid var(--color-border)',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition:
          'background-color 0.22s ease, border-color 0.22s ease, width 0.2s ease',
      }}
    >
      {/* Top: Logo + CMD trigger */}
      <div
        style={{
          padding: '18px 16px 12px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <LogoMark />

        {/* CMD trigger — hidden on icon-strip sidebar */}
        <button
          onClick={() => setIsOpen(true)}
          className="hidden lg:flex hover:border-[var(--color-accent-l)] hover:text-[var(--color-ink-3)]"
          style={{
            marginTop: 10,
            width: '100%',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-panel)',
            color: 'var(--color-ink-4)',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s, color 0.15s',
            textAlign: 'left',
          }}
        >
          <Search size={13} aria-hidden="true" />
          <span style={{ flex: 1 }}>Quick actions…</span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 10,
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              padding: '1px 5px',
              color: 'var(--color-ink-4)',
            }}
          >
            ⌘K
          </span>
        </button>

        {/* CMD icon button — visible only on icon-strip sidebar */}
        <button
          onClick={() => setIsOpen(true)}
          title="Quick actions (⌘K)"
          aria-label="Quick actions"
          className="lg:hidden hover:bg-[var(--color-bg-hover)]"
          style={{
            marginTop: 10,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-panel)',
            color: 'var(--color-ink-4)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.13s',
          }}
        >
          <Search size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Navigation */}
      <SidebarNav />

      {/* Bottom: Theme + Social */}
      <div
        style={{
          padding: '12px 8px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Compact (icon-strip md–lg) */}
        <div className="md:block lg:hidden">
          <ThemeSwitcher theme={theme} onThemeChange={setTheme} compact />
        </div>
        {/* Full (lg+) */}
        <div className="hidden lg:block">
          <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
        </div>
        {/* Social links hidden on icon-strip sidebar */}
        <div className="hidden lg:block">
          <SocialLinks />
        </div>
      </div>
    </aside>
  );
}
