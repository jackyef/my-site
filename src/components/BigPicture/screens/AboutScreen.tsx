import { useReduceMotion } from '@/hooks/useReduceMotion';

import { FocusCard } from '../components/FocusCard';

const LINKS = [
  { label: 'Twitter / X', href: 'https://twitter.com/jackyef__', icon: '🐦' },
  { label: 'GitHub', href: 'https://github.com/jackyef', icon: '🐙' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jackyef', icon: '💼' },
];

const ROLES = [
  { period: 'Now', company: 'Sticker Mule', role: 'Software Engineer' },
  { period: 'Before', company: 'Tokopedia', role: 'Frontend Engineer' },
];

export const AboutScreen = () => {
  const prefersReducedMotion = useReduceMotion();

  return (
    <div
      className="flex flex-col gap-6 flex-1 overflow-y-auto"
      data-bp-scrollable
    >
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">About</h1>
        <p className="text-lg text-white/50">Hey, I&apos;m Jacky.</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <p className="text-white/80 leading-relaxed text-lg">
          I&apos;m a software engineer with a focus on the web. I care deeply
          about performance, developer experience, and building things that are
          both functional and delightful to use.
        </p>
        <p className="text-white/60 leading-relaxed text-lg mt-3">
          When I&apos;m not writing code, I&apos;m probably playing chess,
          listening to music, or overthinking UI interactions.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white/70 uppercase tracking-wider mb-3 text-sm">
          Experience
        </h2>
        <div className="flex flex-col gap-2">
          {ROLES.map(({ period, company, role }) => (
            <div
              key={company}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4"
            >
              <div>
                <p className="text-white font-medium">{company}</p>
                <p className="text-white/50 text-sm">{role}</p>
              </div>
              <span className="text-white/30 text-sm">{period}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white/70 uppercase tracking-wider mb-3 text-sm">
          Links
        </h2>
        <div
          className="flex flex-row gap-3 overflow-x-auto py-3 px-2 scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {LINKS.map(({ label, href, icon }) => (
            <FocusCard
              key={label}
              row="links"
              prefersReducedMotion={prefersReducedMotion}
              onClick={() => window.open(href, '_blank')}
              className="flex items-center gap-3 px-5 py-4 shrink-0"
            >
              <span className="text-xl">{icon}</span>
              <span className="text-white/80 text-sm font-medium">{label}</span>
            </FocusCard>
          ))}
        </div>
      </div>

      <div className="pb-8" />
    </div>
  );
};
