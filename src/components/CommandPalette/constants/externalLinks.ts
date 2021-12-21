/**
 * We store all external links we want to be available in the Command Palette here.
 */

import { matchSorter } from 'match-sorter';
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
  const matched = matchSorter(EXTERNAL_LINKS, query, {
    keys: ['title', 'hiddenSearchTerm', 'description', 'link'],
  });

  return matched;
};
