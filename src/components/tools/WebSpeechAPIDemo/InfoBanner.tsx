import clsx from 'clsx';
import { css } from 'goober';

import { getHslaColor } from '@/lib/styles/colors';

export const InfoBanner = () => {
  const container = css`
    color: ${getHslaColor('primary', 1, { l: -12 })};

    [data-theme='dark'] & {
      color: ${getHslaColor('primary')};
    }

    background: ${getHslaColor('primary', 0.04)};
    border-color: ${getHslaColor('primary')};
  `;

  return (
    <div
      className={clsx(
        container,
        'lg:mx-8',
        'my-8',
        'p-8',
        'rounded-2xl',
        'border-2',
        'space-y-2',
      )}
    >
      <h3 className="text-xl mb-4">Note</h3>
      At the time of this writing, the Web Speech API does not seem to be well
      implemented across browsers yet. It works well on desktop version of
      Chrome. It also works on desktop Safari but the experience is not as
      smooth. Though, it does not seem to work on mobile browsers, even Chrome
      on Android.
      <p>
        You can also try{' '}
        <a
          href="https://www.google.com/intl/en/chrome/demos/speech.html"
          rel="noreferrer"
          target="_blank"
          className={clsx('underline', 'hover:no-underline')}
        >
          Google&apos;s own hosted demo
        </a>
        .
      </p>
    </div>
  );
};
