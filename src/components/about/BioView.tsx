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
        <Text color="ink-2" className="font-light leading-[1.75]">
          I build for the web. Primarily frontend-focused, but can manage
          my way around the stack if the need arises. Most of my career has been
          an act of balancing between the product and infrastructure part of the
          frontend work.
        </Text>

        <Text color="ink-2" className="leading-[1.75]">
          I am curious by nature and love to learn how things work. Since the
          start of my career, I have always learned by questioning the way
          things work. I built{' '}
          <TextLink href="https://github.com/jackyef/simple-module-bundler">
            an overly-simplified module bundler
          </TextLink>
          ,{' '}
          <TextLink href="https://github.com/jackyef/react-isomorphic-data">
            SSR-supporting data-fetching library for React
          </TextLink>
          , and{' '}
          <TextLink href="https://github.com/jackyef/basic-css-in-js">
            basic CSS-in-JS library
          </TextLink>
          , just to understand the fundamentals of the web platform.
        </Text>
        <Text color="ink-2" className="leading-[1.75]">
          I worked with developer toolings within JS monorepos. Speeding up
          local development, CI pipelines, webpack builds, establishing
          conventions and optimizing web pages. Other than that, I also have
          worked on the server-side with Node.js and PostgreSQL.
        </Text>
        <Text color="ink-2" className="leading-[1.75]">
          I am currently based in Jakarta, Indonesia and working here as well,
          but I am open to remote roles across the globe.
        </Text>
        <Text color="ink-2" className="leading-[1.75]">
          I started playing chess on{' '}
          <ExternalLink href="https://chess.com/member/pixelparser">
            Chess.com (PixelParser)
          </ExternalLink>{' '}
          in 2023 and found it quite enjoyable! (When I am not on losing streak,
          that is)
        </Text>
      </div>
    </div>
  );
}
