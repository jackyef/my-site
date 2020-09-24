import dynamic from 'next/dynamic'

export const LazyWebmentionWidget = dynamic(
  () => import(/* webpackChunkName: "webmention-widget" */ './index'),
  { 
    ssr: false,
    loading: () => <h3 className="text-lg font-bold mb-2">Webmentions</h3>
  }
)