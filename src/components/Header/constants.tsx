import { sendEventTracker } from '@/utils/analytics/tracker';

import { Logo } from './Logo';

export const navLinks = [
  {
    href: '/',
    'aria-label': "Jacky Efendi's personal site",
    onClick: () => {
      sendEventTracker({
        name: 'click',
        category: 'header nav',
        label: 'logo',
      });
    },
    children: <Logo />,
  },
  {
    href: '/blog',
    'aria-label': 'blog',
    onClick: () => {
      sendEventTracker({
        name: 'click',
        category: 'header nav',
        label: 'blog',
      });
    },
    children: 'Blog',
  },
];
