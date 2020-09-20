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

interface PostMeta {
  title: string;
  description: string;
  date: string;
  image: string;
}

interface Post {
  link: string;
  module: {
    default: {
      Component: React.ElementType;
      meta: PostMeta;
    };
  };
}

export default function getAllPostPreviews(): Post[] {
  return importAll(
    require.context('../pages/?preview', true, /\.mdx$/),
  ).sort((a: any, b: any) =>
    dateSortDesc(a.module.meta.date, b.module.meta.date),
  );
}
