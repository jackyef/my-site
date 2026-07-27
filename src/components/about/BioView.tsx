import { PageHeader } from '@/components/common/PageHeader';
import { Text } from '@/components/common/Text';
import { ExternalLink } from '@/components/Typography/ExternalLink';
import { SOCIALS } from '@/constants/socials';

export function BioView() {
  return (
    <div className="page-pad">
      <PageHeader
        eyebrow="About"
        title={
          <>
            I build for <em>the web.</em>
          </>
        }
        titleSpacing="mb-3"
      />

      <div className="flex flex-col gap-4 max-w-[720px]">
        <Text color="ink-3" className="leading-[1.75]">
          Frontend is where I go deepest, but I&apos;ve spent enough time in the
          surrounding infrastructure to understand how the whole thing fits
          together. Most of my career has been an act of balancing between the
          product and infrastructure part of the frontend work.
        </Text>

        <Text color="ink-3" className="leading-[1.75]">
          I am curious by nature and love to learn how things work. When I want
          to understand how something works, I build a stripped-down version of
          it. I&apos;ve built{' '}
          <ExternalLink href="https://github.com/jackyef/simple-module-bundler">
            an overly-simplified module bundler
          </ExternalLink>
          ,{' '}
          <ExternalLink href="https://github.com/jackyef/react-isomorphic-data">
            an SSR-supporting data-fetching library for React
          </ExternalLink>
          , and{' '}
          <ExternalLink href="https://github.com/jackyef/basic-css-in-js">
            a basic CSS-in-JS library
          </ExternalLink>
          , just to understand the fundamentals of the web platform. Some of
          those works became writing:{' '}
          <ExternalLink href="https://medium.com/tokopedia-engineering/getting-content-painted-under-2-seconds-on-the-mobile-web-7b3bbaca32cb?source=---------2----------------------------">
            getting Tokopedia&apos;s mobile web loaded under 2 seconds
          </ExternalLink>
          ,{' '}
          <ExternalLink href="https://medium.com/tokopedia-engineering/building-60-fps-qr-scanner-for-the-mobile-web-eb0deddce099?source=---------5----------------------------">
            building a 60fps QR scanner with WebAssembly
          </ExternalLink>
          ,{' '}
          <ExternalLink href="https://medium.com/better-programming/the-case-for-pnpm-over-npm-or-yarn-2b221607119?source=---------4----------------------------">
            making the case for pnpm before it was cool
          </ExternalLink>
          .
        </Text>
        <Text color="ink-3" className="leading-[1.75]">
          I&apos;ve worked on developer experience within JS monorepos. Speeding
          up local development, CI pipelines, webpack builds, establishing
          conventions and optimizing web pages. On the server side, I&apos;ve
          worked with Node.js, GraphQL, Apollo, and PostgreSQL.
        </Text>
        <Text color="ink-3" className="leading-[1.75]">
          Based in Jakarta (UTC+7), working remotely. Always happy to chat about
          potential opportunities — find me on{' '}
          <ExternalLink
            href={SOCIALS.find((s) => s.label === 'Twitter')?.href || '#'}
          >
            X/Twitter
          </ExternalLink>{' '}
          or{' '}
          <ExternalLink
            href={SOCIALS.find((s) => s.label === 'LinkedIn')?.href || '#'}
          >
            LinkedIn
          </ExternalLink>
          . Or if you prefer old-fashioned email, you can reach me at{' '}
          <ExternalLink
            href={SOCIALS.find((s) => s.label === 'Email')?.href || '#'}
          >
            hello[at]jackyef[dot]com
          </ExternalLink>
          .
        </Text>
      </div>
    </div>
  );
}
