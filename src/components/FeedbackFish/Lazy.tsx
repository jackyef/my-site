import dynamic from 'next/dynamic'

export const LazyFeedbackFish = dynamic(
    () => import(/* webpackChunkName: "feedbackfish-widget" */ './index'),
    { 
      ssr: false,
      loading: () => null,
    }
  )