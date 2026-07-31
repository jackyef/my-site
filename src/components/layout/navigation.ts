import {
  FlaskConicalIcon,
  HomeIcon,
  PenLineIcon,
  SwatchBookIcon,
  UserIcon,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  exact?: boolean;
}

export const PAGE_LINKS: NavItem[] = [
  { href: '/', label: 'Home', Icon: HomeIcon, exact: true },
  { href: '/about', label: 'About', Icon: UserIcon },
  { href: '/blog', label: 'Blog', Icon: PenLineIcon },
];

// The individual experiments used to sit here one row each, which read as five
// peer destinations when they are really one collection. They live behind
// /experiments now, so this stays two rows however many experiments there end
// up being.
export const TOOL_LINKS: NavItem[] = [
  { href: '/design', label: 'Design system', Icon: SwatchBookIcon },
  { href: '/experiments', label: 'Lab', Icon: FlaskConicalIcon },
];

/**
 * Both navs render the same destinations, so they resolve "active" the same
 * way too. When these lived as two hand-copied arrays the mobile drawer
 * silently lost the Misc group and never learned the /posts/ rule — one list
 * and one predicate is what keeps them honest.
 */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.exact) return pathname === item.href;

  // A post is a child of the blog in the reader's mind, not in the route.
  if (pathname.startsWith('/posts/') && item.href === '/blog') return true;

  return pathname === item.href || pathname.startsWith(item.href + '/');
}
