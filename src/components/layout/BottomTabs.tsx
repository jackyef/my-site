import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, User, PenLine, Wrench, MoreHorizontal } from 'lucide-react';

const TABS = [
  {
    href: '/',
    label: 'Home',
    icon: <Home size={18} aria-hidden="true" />,
    exact: true,
  },
  {
    href: '/about',
    label: 'About',
    icon: <User size={18} aria-hidden="true" />,
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: <PenLine size={18} aria-hidden="true" />,
  },
  {
    href: '/uses',
    label: 'Uses',
    icon: <Wrench size={18} aria-hidden="true" />,
  },
  {
    href: '/tools/playground',
    label: 'More',
    icon: <MoreHorizontal size={18} aria-hidden="true" />,
  },
];

export function BottomTabs() {
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return router.pathname === href;
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: 'var(--color-bg-sidebar)',
        borderTop: '1px solid var(--color-border)',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.href, tab.exact);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '8px 4px',
              fontSize: 10,
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--color-accent-text)' : 'var(--color-ink-4)',
              textDecoration: 'none',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
