/**
 * We store all external links we want to be available in the Command Palette here.
 */

import { PageData } from '../../../../types/types';

export const EXTERNAL_LINKS: readonly PageData[] = [
  {
    title: 'Source code',
    description: `I keep the code for this site open-source on GitHub. It's not the prettiest, but you might find it useful. 🤓`,
    link: 'https://github.com/jackyef/my-site',
    hiddenSearchTerm: 'social gh',
  },
  {
    title: 'GitHub',
    description: 'Check out my GitHub profile 🐙🐱',
    link: 'https://github.com/jackyef',
    hiddenSearchTerm: 'social gh',
  },
  {
    title: 'Twitter',
    description:
      'Follow me on Twitter! I tweet random stuffs related to tech and adulting life there 🙂',
    link: 'https://twitter.com/jackyef__',
    hiddenSearchTerm: 'social',
  },
];

export const filterExternalLinks = (query: string): PageData[] => {
  const words = query.split(' ').map((word) => word.toLowerCase());

  return EXTERNAL_LINKS.filter((page) =>
    words.every(
      (word) =>
        page.title.toLowerCase().includes(word) ||
        page.description.toLowerCase().includes(word) ||
        page.hiddenSearchTerm?.toLowerCase().includes(word),
    ),
  );
};
