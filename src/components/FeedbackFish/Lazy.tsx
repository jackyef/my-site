import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { IOWrapper } from '../IntersectionObserver/Wrapper';

export const LazyFeedbackFish = dynamic(
  () => import(/* webpackChunkName: "feedbackfish-widget" */ './index'),
  {
    ssr: false,
    suspense: true,
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
    {(show) =>
      show ? (
        <Suspense fallback={null}>
          <LazyFeedbackFish {...rest} />
        </Suspense>
      ) : (
        placeholder
      )
    }
  </IOWrapper>
);
