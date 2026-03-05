import { Github, Linkedin, Twitter } from 'lucide-react';

export type Social = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const SOCIALS: Social[] = [
  {
    href: 'https://twitter.com/jackyef__',
    label: 'Twitter',
    icon: <Twitter size={14} aria-hidden="true" />,
  },
  {
    href: 'https://github.com/jackyef',
    label: 'GitHub',
    icon: <Github size={14} aria-hidden="true" />,
  },
  {
    href: 'https://linkedin.com/in/jackyef',
    label: 'LinkedIn',
    icon: <Linkedin size={14} aria-hidden="true" />,
  },
];
