import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { IOWrapper } from '../IntersectionObserver/Wrapper';

import type { FeedbackFishProps } from './index';

export const LazyFeedbackFish = dynamic<FeedbackFishProps>(
  () => import(/* webpackChunkName: "feedbackfish-widget" */ './index'),
  {
    ssr: false,
    suspense: true,
  },
);

interface Props {
  placeholder?: JSX.Element;
}

export const IOLazyFeedbackFish: React.FC<Props & FeedbackFishProps> = ({
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
