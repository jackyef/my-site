import Link from 'next/link';

import { StatusDot } from '@/components/common/StatusDot';

export function HeroSection() {
  return (
    <div className="hero-pad">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--color-ink-2)] mb-[18px]">
        <StatusDot />
        Jakarta · Open to remote
      </div>

      {/* Heading */}
      <h1 className="hero-h1 mb-3">
        Jacky
        <br />
        <em>Efendi.</em>
      </h1>

      {/* Role */}
      <p
        className="font-serif font-light text-[var(--color-ink-2)] mb-[18px] tracking-[-0.01em]"
        style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
      >
        Product Engineer, Frontend &amp; beyond.
      </p>

      {/* Description */}
      <p className="text-[15px] leading-[1.75] text-[var(--color-ink-3)] mb-8 max-w-[540px]">
        I build for the web — from performance infrastructure and design systems
        to the product interfaces people actually use. Deep enough in the
        frontend to care about every detail, fluent enough across the stack to
        never be blocked.
      </p>

      {/* CTAs */}
      <div className="flex gap-[10px] flex-wrap">
        <Link
          href="/about"
          className="inline-flex items-center px-5 py-[9px] rounded-lg bg-[var(--color-accent)] text-white text-[14px] font-semibold no-underline transition-[filter,transform] duration-[180ms] hover:[filter:brightness(1.1)] hover:[-translate-y-px]"
        >
          Read about me →
        </Link>
        <Link
          href="/about/readme"
          className="inline-flex items-center px-5 py-[9px] rounded-lg bg-transparent text-[var(--color-ink-2)] text-[14px] font-medium border border-[var(--color-border-hi)] no-underline transition-[background,border-color] duration-[180ms] hover:bg-[var(--color-bg-hover)]"
        >
          My README
        </Link>
      </div>
    </div>
  );
}
