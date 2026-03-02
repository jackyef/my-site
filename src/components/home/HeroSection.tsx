import Link from 'next/link';

import { Button } from '@/components/common/Button';
import { Heading } from '@/components/common/Heading';

export function HeroSection() {
  return (
    <div className="hero-pad">

      {/* Heading */}
      <Heading level="hero" className="mt-6 mb-3">
        Jacky <em>Efendi</em>
      </Heading>

      {/* Role */}
      <p
        className="font-serif font-light text-(--color-ink-2) mb-[18px] tracking-[-0.01em]"
        style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
      >
        Product Engineer, Frontend &amp; beyond.
      </p>

      {/* Description */}
      <p className="text-[15px] leading-[1.75] text-(--color-ink-3) mb-4 max-w-[540px]">
        I build for the web — from performance, infrastructure and design systems
        to the product interfaces users actually use. Frontend-focused, adaptable across the stack when needed.
      </p>

      <p className="text-[15px] leading-[1.75] text-(--color-ink-3) mb-8 max-w-[540px]">
        I have been working async for 5+ years with teammates around the globe.
        Aligning, communicating and shipping effectively on a daily basis.
      </p>

      {/* CTAs */}
      <div className="flex gap-2.5 flex-wrap">
        <Button as={Link} href="/about">
          More about me →
        </Button>
      </div>
    </div>
  );
}
