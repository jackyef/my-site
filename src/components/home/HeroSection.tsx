import { Heading } from '@/components/common/Heading';

import { HeroCTA } from './HeroCTA';

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
        I build for the web: performance, design systems, developer
        tooling, and the product interfaces people actually use. Frontend is
        where I go deepest, but I&apos;ve spent enough time in the surrounding
        infrastructure to understand how the whole thing fits together.
      </p>

      <p className="text-[15px] leading-[1.75] text-(--color-ink-3) mb-8 max-w-[540px]">
        8 years in, 5 fully remote across teams on 5 continents.
        I&apos;ve come to believe async work runs on a few things: writings that
        leave little room for guessing, questions asked early but not treated as
        blockers, a bias toward making progress with what you have and trust
        that everyone is doing the same.
      </p>

      {/* CTAs */}
      <div className="flex gap-2.5 flex-wrap">
        <HeroCTA />
      </div>
    </div>
  );
}
