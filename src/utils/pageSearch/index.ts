import { matchSorter } from 'match-sorter';

import { PageData } from '../../../types/types';

const pageData = require('./_files/pages-data.json') as PageData[];

export const search = (query: string) => {
  const matched = matchSorter(pageData, query, {
    keys: ['title', 'hiddenSearchTerm', 'description', 'link'],
  });

  return matched;
};
