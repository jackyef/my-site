import { LazyFeedbackFish } from "@/components/FeedbackFish/Lazy"

export const Footer = () => {
  return (
    <footer className="text-sm text-center py-8">
      <a href="https://github.com/jackyef" rel="me">
        &lt;/&gt;
      </a>{' '}
      &middot;{' '}
      <a href="https://twitter.com/jackyef__" rel="me">
        @jackyef__
      </a>{' '}
      &middot;{' '}
      <a href="https://www.linkedin.com/in/jackyef/" rel="me">
        LinkedIn
      </a>{' '}
      &middot;{' '}
      <LazyFeedbackFish>
        <button>
          Got feedback?
        </button>
      </LazyFeedbackFish>
    </footer>
  );
};
