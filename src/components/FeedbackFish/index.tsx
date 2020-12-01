import { FeedbackFish } from '@feedback-fish/react'

const FEEDBACK_FISH_PROJECTID = '6a8ca0f6d649bd';

interface Props {
  // FeedbackFish doesn't accept 'null' children, so we have to do this
  children: React.ReactElement;
}

const OurFeedbackFish = ({ children }: Props) => (
  <FeedbackFish projectId={FEEDBACK_FISH_PROJECTID}>
    {children}
  </FeedbackFish>
)

export default OurFeedbackFish;
