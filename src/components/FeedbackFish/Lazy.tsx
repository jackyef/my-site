import dynamic from 'next/dynamic'
import { IOWrapper } from '../IntersectionObserver/Wrapper';

export const LazyFeedbackFish = dynamic(
  () => import(/* webpackChunkName: "feedbackfish-widget" */ './index'),
  {
    ssr: false,
    loading: () => null,
  }
);

export const IOLazyFeedbackFish: React.FC = (props) => (
  <IOWrapper>
    {(show) =>
      show ? <LazyFeedbackFish {...props} /> : <button>Got feedback?</button>
    }
  </IOWrapper>
)