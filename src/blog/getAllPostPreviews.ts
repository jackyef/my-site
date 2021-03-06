import { Author } from './authors';

function importAll(r: any) {
  return r.keys().map((fileName: string) => ({
    link: fileName.substr(1).replace(/\/index\.mdx$/, ''),
    module: r(fileName),
  }));
}

function dateSortDesc(a: string, b: string) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  image: string;
  authors: Author[];
  readingTime: string;
}

/** This is what is exported out of a .mdx file */
export interface Post {
  link: string;
  module: {
    default: React.ComponentType;
    meta: PostMeta;
  };
}

export default function getAllPostPreviews(): Post[] {
  return importAll(
    require.context('../pages/?preview', true, /\.mdx$/),
  ).sort((a: any, b: any) =>
    dateSortDesc(a.module.meta.date, b.module.meta.date),
  );
}
