import { Twitter, Github, Linkedin, Crown } from 'lucide-react';

const SOCIALS = [
  {
    href: 'https://twitter.com/jackyef__',
    label: 'Twitter',
    icon: <Twitter size={13} aria-hidden="true" />,
  },
  {
    href: 'https://github.com/jackyef',
    label: 'GitHub',
    icon: <Github size={13} aria-hidden="true" />,
  },
  {
    href: 'https://linkedin.com/in/jackyef',
    label: 'LinkedIn',
    icon: <Linkedin size={13} aria-hidden="true" />,
  },
  {
    href: 'https://chess.com/member/pixelparser',
    label: 'Chess.com',
    icon: <Crown size={13} aria-hidden="true" />,
  },
];

export function SocialLinks() {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {SOCIALS.map(({ href, label, icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          aria-label={label}
          style={{
            flex: 1,
            display: 'grid',
            placeItems: 'center',
            height: 30,
            borderRadius: 7,
            color: 'var(--color-ink-4)',
            fontSize: 13,
            transition: 'background 0.13s, color 0.13s',
          }}
          className="hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-accent-text)]"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
