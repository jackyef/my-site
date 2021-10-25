import { IOLazyFeedbackFish } from '@/components/FeedbackFish/Lazy';

export const Footer = () => {
  return (
    <footer className="text-sm text-center py-8">
      <a href="https://github.com/jackyef/my-site">&lt;/&gt;</a> &middot;{' '}
      <a href="https://twitter.com/jackyef__" rel="me">
        @jackyef__
      </a>{' '}
      &middot;{' '}
      <a href="https://www.linkedin.com/in/jackyef/" rel="me">
        LinkedIn
      </a>{' '}
      &middot;{' '}
      <IOLazyFeedbackFish>
        <button>Got feedback?</button>
      </IOLazyFeedbackFish>
    </footer>
  );
};
