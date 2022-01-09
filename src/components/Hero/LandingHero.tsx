import { sendEventTracker } from '@/utils/analytics/tracker';
import clsx from 'clsx';
import { css } from 'goober';
import { useRouter } from 'next/router';
import { ExternalLink } from '../Typography/ExternalLink';
import { InternalLink } from '../Typography/InternalLink';
import { Paragraph } from '../Typography/Paragraph';

export const LandingHero = () => {
  const router = useRouter();
  const container = css`
    --bg-opacity: 0.4;
    background: rgba(var(--rgb-bg), var(--bg-opacity));
    backdrop-filter: contrast(105%) saturate(120%) blur(8px);
    z-index: 3;
    transition: var(--transition-default);

    @supports (backdrop-filter: blur(8px)) {
      --bg-opacity: 0.2;
    }
  `;

  return (
    <>
      <div
        className={clsx(
          container,
          'p-4',
          'sm:p-8',
          'rounded-b-none',
          'sm:rounded-xl',
          '-mx-4',
          'sm:mx-0',
          '-mt-12', // Cancels out the padding of <PageContainer />
          'sm:mt-0',
        )}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-theme-heading transition-colors">
          Hi, I am Jacky! 👋
        </h1>
        <Paragraph>
          I am a software engineer working with JavaScript and on
          all-things-web. I am currently based in Jakarta, Indonesia (🇮🇩),
          working remotely at{' '}
          <ExternalLink href="https://www.stickermule.com">
            Sticker Mule
          </ExternalLink>
          . You might know me from my previous work with{' '}
          <ExternalLink href="https://www.tokopedia.com">
            Tokopedia&rsquo;s Web Platform team
          </ExternalLink>
          .
        </Paragraph>

        <Paragraph>
          <InternalLink
            href="/about"
            onClick={() => {
              sendEventTracker({
                name: 'click',
                category: `${router.pathname} - hero`,
                label: 'More about me &arr;',
              });
            }}
          >
            More about me &rarr;
          </InternalLink>
        </Paragraph>

        <Paragraph>
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
        </Paragraph>
      </div>
    </>
  );
};
