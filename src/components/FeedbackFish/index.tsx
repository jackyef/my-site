import { FeedbackFish } from '@feedback-fish/react';

const FEEDBACK_FISH_PROJECTID = '6a8ca0f6d649bd';

export interface FeedbackFishProps {
  children?: React.ReactNode;
}

const OurFeedbackFish = ({ children }: FeedbackFishProps) => (
  <FeedbackFish projectId={FEEDBACK_FISH_PROJECTID}>
    {children as React.ReactElement}
  </FeedbackFish>
);

export default OurFeedbackFish;
