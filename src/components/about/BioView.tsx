import { PageHeader } from '@/components/common/PageHeader';
import { Text } from '@/components/common/Text';
import { ExternalLink } from '@/components/Typography/ExternalLink';

import { TextLink } from '../common/TextLink';

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
          it. I&apos; built{' '}
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
          those works became writing: getting Tokopedia&apos;s mobile web loaded
          under 2 seconds, building a 60fps QR scanner with WebAssembly, making
          the case for pnpm before it was cool. See{' '}
          <TextLink href="#past-writings">past writings &rarr;</TextLink>.
        </Text>
        <Text color="ink-3" className="leading-[1.75]">
          I&apos;ve worked on developer experience within JS monorepos. Speeding
          up local development, CI pipelines, webpack builds, establishing
          conventions and optimizing web pages. On the server side, I&apos;ve
          worked with Node.js, GraphQL, Apollo, and PostgreSQL
        </Text>
        <Text color="ink-3" className="leading-[1.75]">
          Based in Jakarta, working remotely, open to teams anywhere.
        </Text>
      </div>
    </div>
  );
}
