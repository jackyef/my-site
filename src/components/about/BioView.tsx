import { PageHeader } from '@/components/common/PageHeader';
import { Text } from '@/components/common/Text';
import { ExternalLink } from '@/components/Typography/ExternalLink';

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
      <Text color="ink-2" className="mb-[18px] font-light leading-[1.75]">
        Curious by nature, obsessed with craft. I work across the full frontend
        spectrum — from performance tooling and build infrastructure to the
        design systems and product features that millions of people use.
      </Text>

      <div className="flex flex-col gap-4 max-w-[600px]">
        <Text variant="body-sm" color="ink-3" className="leading-[1.75]">
          I am a software engineer working on all-things-web. I am a curious
          person and I love to learn how things work. It gives me a satisfying
          feeling when I discover the reasons why some things are made the way
          they are.
        </Text>
        <Text variant="body-sm" color="ink-3" className="leading-[1.75]">
          Most of my experience are with React and front-end development. I work
          on both infrastructure and product side of the frontend work. I like
          to strengthen fundamentals and concepts to allow me to learn other
          things easier, even when they may not be necessarily closely related
          to front-end development.
        </Text>
        <Text variant="body-sm" color="ink-3" className="leading-[1.75]">
          I am currently based in Jakarta, Indonesia and working here as well,
          but I am open to remote roles across the globe.
        </Text>
        <Text variant="body-sm" color="ink-3" className="leading-[1.75]">
          Feel free to reach me on{' '}
          <ExternalLink href="https://twitter.com/jackyef__">
            Twitter/X
          </ExternalLink>{' '}
          or{' '}
          <ExternalLink href="https://linkedin.com/in/jackyef">
            LinkedIn
          </ExternalLink>
          . I am always happy to chat!
        </Text>
        <Text variant="body-sm" color="ink-3" className="leading-[1.75]">
          I also occasionally play chess on{' '}
          <ExternalLink href="https://chess.com/member/pixelparser">
            Chess.com (PixelParser)
          </ExternalLink>{' '}
          — started in 2023 and found it quite enjoyable!
        </Text>
      </div>
    </div>
  );
}
