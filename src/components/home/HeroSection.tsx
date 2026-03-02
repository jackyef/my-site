import Link from 'next/link';

import { Button } from '@/components/common/Button';
import { Heading } from '@/components/common/Heading';
import { StatusDot } from '@/components/common/StatusDot';

export function HeroSection() {
  return (
    <div className="hero-pad">
      {/* Badge */}
      <div className="inline-flex items-center gap-[7px] bg-(--color-accent-xl) border border-(--color-accent-l) rounded-full px-3 py-1 text-[12px] font-medium text-(--color-accent-text) mb-[18px]">
        <StatusDot />
        Jakarta · Open to remote
      </div>

      {/* Heading */}
      <Heading level="hero" className="mb-3">
        Jacky
        <br />
        <em>Efendi.</em>
      </Heading>

      {/* Role */}
      <p
        className="font-serif font-light text-(--color-ink-2) mb-[18px] tracking-[-0.01em]"
        style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
      >
        Product Engineer, Frontend &amp; beyond.
      </p>

      {/* Description */}
      <p className="text-[15px] leading-[1.75] text-(--color-ink-3) mb-8 max-w-[540px]">
        I build for the web — from performance infrastructure and design systems
        to the product interfaces people actually use. Deep enough in the
        frontend to care about every detail, fluent enough across the stack to
        never be blocked.
      </p>

      {/* CTAs */}
      <div className="flex gap-[10px] flex-wrap">
        <Button as={Link} href="/about">
          Read about me →
        </Button>
        <Button as={Link} href="/about/readme" variant="secondary">
          My README
        </Button>
      </div>
    </div>
  );
}
