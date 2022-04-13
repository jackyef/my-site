import clsx from 'clsx';
import { css } from 'goober';

export const InfoBanner = () => {
  const container = css`
    --text-lightness: calc(var(--l-primary) - 12%);

    [data-theme='dark'] & {
      --text-lightness: var(--l-primary);
    }

    color: hsl(var(--h-primary) var(--s-primary) var(--text-lightness));
    background: hsla(var(--h-primary) var(--s-primary) var(--l-primary) / 0.04);
    border-color: hsl(var(--h-primary) var(--s-primary) var(--l-primary));
  `;

  return (
    <div
      className={clsx(
        container,
        'lg:mx-8',
        'mt-8',
        'mb-16',
        'p-8',
        'rounded-2xl',
        'border-2',
      )}
    >
      <h3 className="text-xl mb-4">Note</h3>
      At the time of this writing, the Web Speech API does not seem to be well
      implemented across browsers. It works well on desktop version of Chrome.
      It also works on desktop Safari but the experience is not as smooth.
      Though, it is not going to work on mobile Chrome.
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
