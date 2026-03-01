import Link from 'next/link';

export function HeroSection() {
  return (
    <div className="hero-pad">
      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-ink-2)',
          marginBottom: 18,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#4caf84',
            animation: 'pulse 2.5s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
        Jakarta · Open to remote
      </div>

      {/* Heading */}
      <h1 className="hero-h1" style={{ marginBottom: 12 }}>
        Jacky
        <br />
        <em>Efendi.</em>
      </h1>

      {/* Role */}
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 300,
          color: 'var(--color-ink-2)',
          marginBottom: 18,
          letterSpacing: '-0.01em',
        }}
      >
        Product Engineer, Frontend &amp; beyond.
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.75,
          color: 'var(--color-ink-3)',
          marginBottom: 32,
          maxWidth: 540,
        }}
      >
        I build for the web — from performance infrastructure and design systems
        to the product interfaces people actually use. Deep enough in the
        frontend to care about every detail, fluent enough across the stack to
        never be blocked.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link
          href="/about"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '9px 20px',
            borderRadius: 8,
            background: 'var(--color-accent)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'filter 0.18s, transform 0.18s',
          }}
          className="hover:[filter:brightness(1.1)] hover:[-translate-y-px]"
        >
          Read about me →
        </Link>
        <Link
          href="/about/readme"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '9px 20px',
            borderRadius: 8,
            background: 'transparent',
            color: 'var(--color-ink-2)',
            fontSize: 14,
            fontWeight: 500,
            border: '1px solid var(--color-border-hi)',
            textDecoration: 'none',
            transition: 'background 0.18s, border-color 0.18s',
          }}
          className="hover:bg-[var(--color-bg-hover)]"
        >
          My README
        </Link>
      </div>
    </div>
  );
}
