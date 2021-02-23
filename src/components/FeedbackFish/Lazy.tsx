import dynamic from 'next/dynamic';
import { IOWrapper } from '../IntersectionObserver/Wrapper';

export const LazyFeedbackFish = dynamic(
  () => import(/* webpackChunkName: "feedbackfish-widget" */ './index'),
  {
    ssr: false,
    loading: () => null,
  },
);

interface Props {
  placeholder?: JSX.Element;
}

export const IOLazyFeedbackFish: React.FC<Props> = ({
  placeholder = <button>Got feedback?</button>,
  ...rest
}) => (
  <IOWrapper inline>
    {(show) => (show ? <LazyFeedbackFish {...rest} /> : placeholder)}
  </IOWrapper>
);
