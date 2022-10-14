import type { Post } from './getAllPostPreviews';

const importAll = (r: any) => {
  return r.keys().map((fileName: string) => ({
    link: `/thoughts${fileName.substr(1).replace(/\/index\.mdx$/, '')}`,
    module: r(fileName),
  }));
};

const dateSortDesc = (a: string, b: string) => {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};

export const getAllThoughtPages = (): Post[] => {
  return importAll(require.context('../pages/thoughts', true, /\.mdx$/)).sort(
    (a: any, b: any) => dateSortDesc(a.module.meta.date, b.module.meta.date),
  );
};
