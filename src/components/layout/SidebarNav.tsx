import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Home,
  User,
  BookOpen,
  PenLine,
  Wrench,
  FlaskConical,
  Palette,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const PAGE_LINKS: NavItem[] = [
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
    href: '/about/readme',
    label: 'README',
    icon: <BookOpen size={16} aria-hidden="true" />,
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

const TOOL_LINKS: NavItem[] = [
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

function NavButton({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      title={item.label}
      className={[
        // On icon-strip (md–lg): center icon; on full sidebar (lg+): left-align
        'md:justify-center lg:justify-start',
        !isActive
          ? 'hover:bg-[var(--color-bg-hover)] hover:!text-[var(--color-ink)]'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        width: '100%',
        padding: '7px 10px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--color-accent-text)' : 'var(--color-ink-3)',
        background: isActive ? 'var(--color-bg-active)' : 'transparent',
        transition: 'background 0.13s, color 0.13s',
        position: 'relative',
        textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      {isActive && (
        <span
          className="hidden lg:block"
          style={{
            position: 'absolute',
            left: -8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: 16,
            background: 'var(--color-accent)',
            borderRadius: '0 3px 3px 0',
          }}
        />
      )}
      <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        {item.icon}
      </span>
      {/* Label hidden on icon-strip sidebar */}
      <span className="hidden lg:block">{item.label}</span>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    /* Label hidden on icon-strip sidebar */
    <div
      className="hidden lg:block"
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-4)',
        padding: '10px 8px 5px',
      }}
    >
      {children}
    </div>
  );
}

export function SidebarNav() {
  const router = useRouter();

  const isActive = (item: NavItem) => {
    if (item.exact) return router.pathname === item.href;
    return (
      router.pathname === item.href ||
      router.pathname.startsWith(item.href + '/')
    );
  };

  return (
    <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
      <SectionLabel>Pages</SectionLabel>
      {PAGE_LINKS.map((item) => (
        <NavButton key={item.href} item={item} isActive={isActive(item)} />
      ))}

      <SectionLabel>Tools</SectionLabel>
      {TOOL_LINKS.map((item) => (
        <NavButton key={item.href} item={item} isActive={isActive(item)} />
      ))}
    </nav>
  );
}
