import { PageData } from '../../../types/types';

const pageData = require('./_files/pages-data.json') as PageData[];

export const search = (query: string) => {
  const words = query.split(' ').map((word) => word.toLowerCase());

  return pageData.filter((page) => {
    return words.every(
      (word) =>
        page.title.toLowerCase().includes(word) ||
        page.description.toLowerCase().includes(word),
    );
  });
};
