import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Home,
  User,
  PenLine,
  FlaskConical,
  Palette,
  WandSparkles,
} from 'lucide-react';

import { SectionLabel } from '@/components/common/SectionLabel';

import { cn } from '@/utils/styles/classNames';

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
    href: '/blog',
    label: 'Blog',
    icon: <PenLine size={16} aria-hidden="true" />,
  }
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
  {
    href: '/absurd-ui',
    label: 'Absurd UI',
    icon: <WandSparkles size={16} aria-hidden="true" />,
  },
];

function NavButton({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      title={item.label}
      className={cn(
        'flex items-center gap-[9px] w-full px-[10px] py-[7px] rounded-lg text-[13px] no-underline shrink-0 relative transition-[background,color] duration-[130ms]',
        'md:justify-center lg:justify-start',
        isActive
          ? 'font-semibold text-[var(--color-accent-text)] bg-[var(--color-bg-active)]'
          : 'font-medium text-[var(--color-ink-3)] bg-transparent hover:bg-[var(--color-bg-hover)] hover:!text-[var(--color-ink)]',
      )}
    >
      {isActive && (
        <span className="hidden lg:block absolute -left-2 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[var(--color-accent)] rounded-r-[3px]" />
      )}
      <span className="shrink-0 flex items-center">{item.icon}</span>
      {/* Label hidden on icon-strip sidebar */}
      <span className="hidden lg:block">{item.label}</span>
    </Link>
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
    <nav className="flex-1 overflow-y-auto p-[10px_8px]">
      <SectionLabel className="hidden lg:block px-2 pt-[10px] pb-[5px]">
        Pages
      </SectionLabel>
      {PAGE_LINKS.map((item) => (
        <NavButton key={item.href} item={item} isActive={isActive(item)} />
      ))}

      <SectionLabel className="hidden lg:block px-2 pt-[10px] pb-[5px]">
        Misc
      </SectionLabel>
      {TOOL_LINKS.map((item) => (
        <NavButton key={item.href} item={item} isActive={isActive(item)} />
      ))}
    </nav>
  );
}
