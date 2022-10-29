import dynamic from 'next/dynamic';

export const LazyWebmentionWidget = dynamic(
  () => import(/* webpackChunkName: "webmention-widget" */ './index'),
  {
    ssr: false,
    suspense: false,
  },
);
