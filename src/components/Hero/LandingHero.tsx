import clsx from 'clsx';
import { css } from 'goober';
import { useRouter } from 'next/router';

import { getHslaColor, getHslString } from '@/lib/styles/colors';

import { sendEventTracker } from '@/utils/analytics/tracker';

import { ExternalLink } from '../Typography/ExternalLink';
import { InternalLink } from '../Typography/InternalLink';
import { Paragraph } from '../Typography/Paragraph';

export const LandingHero = () => {
  const router = useRouter();
  const container = css`
    --bg-opacity: 0.4;
    background: hsla(${getHslString('bg')} / var(--bg-opacity));
    backdrop-filter: contrast(105%) saturate(120%) blur(8px);
    z-index: 3;
    transition: background var(--transition-default),
      opacity var(--transition-default);

    @supports (backdrop-filter: blur(8px)) {
      --bg-opacity: 0.2;
      box-shadow: 0 6px 6px 0px ${getHslaColor('bg', 0.4)};
    }
  `;

  const baseCtaButton = css`
    display: inline-block;
    padding: 0.8rem 1.3rem;
    border-radius: 0.75rem;

    transition: background-position var(--transition-faster);
    background-size: 200%;
    background-position: 0% 50%;

    &:hover,
    &:focus {
      background-position: 100% 50%;
    }
  `;

  const ctaButton = css`
    background-image: linear-gradient(
      70deg,
      ${getHslaColor('primary', 0.4)},
      ${getHslaColor('secondary', 0.4)},
      ${getHslaColor('primary', 0.3)}
    );
  `;

  return (
    <>
      <div
        className={clsx(
          container,
          'p-4',
          'pb-8',
          'sm:p-8',
          'rounded-b-none',
          'sm:rounded-xl',
          '-mx-4',
          'sm:mx-0',
          '-mt-12', // Cancels out the padding of <PageContainer />
          'sm:mt-0',
        )}
      >
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-theme-heading transition-colors">
          Hi, I am Jacky! 👋
        </h1>
        <Paragraph>
          I am a software engineer working with JavaScript and on
          all-things-web. In general, I love balancing between infrastructure
          and product side of the frontend work. I am currently based in
          Jakarta, Indonesia (🇮🇩).
        </Paragraph>

        <Paragraph>
          I am{' '}
          <ExternalLink
            href="https://twitter.com/jackyef__"
            onClick={() => {
              sendEventTracker({
                name: 'click',
                category: `${router.pathname} - hero`,
                label: '@jackyef__ on Twitter',
              });
            }}
          >
            @jackyef__ on Twitter
          </ExternalLink>
          . From time to time, I tweet about things I learned in my personal
          journey, be it tech, career, or even just general things about life.
          If you are on the platform, let&rsquo;s connect!
        </Paragraph>

        <div className={clsx('mt-8', 'sm:mt-12', 'flex')}>
          <InternalLink
            className={clsx(baseCtaButton, ctaButton)}
            href="/about"
            onClick={() => {
              sendEventTracker({
                name: 'click',
                category: `${router.pathname} - hero`,
                label: 'More about me &arr;',
              });
            }}
            isNotFancy
          >
            More about me &rarr;
          </InternalLink>
        </div>
      </div>
    </>
  );
};
