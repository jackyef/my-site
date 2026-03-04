import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Home,
  User,
  PenLine,
  FlaskConical,
  Palette,
  WandSparkles,
  Mic,
} from 'lucide-react';

import { SectionLabel } from '@/components/common/SectionLabel';

import { cn } from '@/utils/styles/classNames';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const ICON_PROPS = { size: 16, strokeWidth: 1.5, 'aria-hidden': true } as const;

const PAGE_LINKS: NavItem[] = [
  { href: '/', label: 'Home', icon: <Home {...ICON_PROPS} />, exact: true },
  { href: '/about', label: 'About', icon: <User {...ICON_PROPS} /> },
  { href: '/blog', label: 'Blog', icon: <PenLine {...ICON_PROPS} /> },
];

const TOOL_LINKS: NavItem[] = [
  {
    href: '/tools/playground',
    label: 'Playground',
    icon: <FlaskConical {...ICON_PROPS} />,
  },
  {
    href: '/tools/claymorphism',
    label: 'Claymorphism',
    icon: <Palette {...ICON_PROPS} />,
  },
  {
    href: '/tools/speech-to-text',
    label: 'Speech-to-text',
    icon: <Mic {...ICON_PROPS} />,
  },
  {
    href: '/absurd-ui',
    label: 'Absurd UI',
    icon: <WandSparkles {...ICON_PROPS} />,
  },
];

function NavButton({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-[9px] w-full px-[10px] py-3 lg:py-[7px] rounded-lg text-[13px] no-underline shrink-0 relative transition-[background,color] duration-[130ms]',
        'md:justify-center lg:justify-start',
        isActive
          ? 'font-semibold text-(--color-accent-text) bg-(--color-bg-active)'
          : 'font-medium text-(--color-ink-3) bg-transparent hover:bg-(--color-bg-hover) hover:!text-(--color-ink-2)',
      )}
    >
      {isActive && (
        <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-(--color-accent-2) rounded-r-[3px]" />
      )}
      <span
        className={cn(
          'shrink-0 flex items-center -translate-y-px',
          !isActive && 'opacity-90',
        )}
      >
        {item.icon}
      </span>
      {/* Label hidden on icon-strip sidebar */}
      <span className="hidden lg:block">{item.label}</span>
    </Link>
  );
}

export function SidebarNav() {
  const router = useRouter();

  const isActive = (item: NavItem) => {
    if (item.exact) return router.pathname === item.href;

    if (router.pathname.startsWith('/posts/') && item.href === '/blog')
      return true; // Special case for blog overview page

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
