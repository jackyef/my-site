import { ExternalLink } from '@/components/Typography/ExternalLink';

export function BioView() {
  return (
    <div className="page-pad">
      <p className="eyebrow" style={{ marginBottom: 10 }}>
        About
      </p>
      <h1 className="page-title" style={{ marginBottom: 12 }}>
        I build for <em>the web.</em>
      </h1>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.75,
          color: 'var(--color-ink-2)',
          marginBottom: 18,
          fontWeight: 300,
        }}
      >
        Curious by nature, obsessed with craft. I work across the full frontend
        spectrum — from performance tooling and build infrastructure to the
        design systems and product features that millions of people use.
      </p>

      <div
        style={{
          fontSize: 15,
          lineHeight: 1.75,
          color: 'var(--color-ink-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 600,
        }}
      >
        <p>
          I am a software engineer working on all-things-web. I am a curious
          person and I love to learn how things work. It gives me a satisfying
          feeling when I discover the reasons why some things are made the way
          they are.
        </p>
        <p>
          Most of my experience are with React and front-end development. I work
          on both infrastructure and product side of the frontend work. I like
          to strengthen fundamentals and concepts to allow me to learn other
          things easier, even when they may not be necessarily closely related
          to front-end development.
        </p>
        <p>
          I am currently based in Jakarta, Indonesia and working here as well,
          but I am open to remote roles across the globe.
        </p>
        <p>
          Feel free to reach me on{' '}
          <ExternalLink href="https://twitter.com/jackyef__">
            Twitter/X
          </ExternalLink>{' '}
          or{' '}
          <ExternalLink href="https://linkedin.com/in/jackyef">
            LinkedIn
          </ExternalLink>
          . I am always happy to chat!
        </p>
        <p>
          I also occasionally play chess on{' '}
          <ExternalLink href="https://chess.com/member/pixelparser">
            Chess.com (PixelParser)
          </ExternalLink>{' '}
          — started in 2023 and found it quite enjoyable!
        </p>
      </div>
    </div>
  );
}
