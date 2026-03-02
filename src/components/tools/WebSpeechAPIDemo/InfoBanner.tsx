import { Panel } from '@/components/common/Panel';

export const InfoBanner = () => {
  return (
    <Panel type="info" title="Note">
      <p>
        At the time of this writing, the Web Speech API does not seem to be well
        implemented across browsers yet. It works well on desktop version of
        Chrome. It also works on desktop Safari but the experience is not as
        smooth. Though, it does not seem to work on mobile browsers, even Chrome
        on Android.
      </p>
      <p>
        You can also try{' '}
        <a
          href="https://www.google.com/intl/en/chrome/demos/speech.html"
          rel="noreferrer"
          target="_blank"
          className="underline hover:no-underline"
        >
          Google&apos;s own hosted demo
        </a>
        .
      </p>
    </Panel>
  );
};
