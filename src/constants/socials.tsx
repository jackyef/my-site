import { GithubIcon, LinkedinIcon, MailIcon, TwitterIcon } from 'lucide-react';

export type Social = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const SOCIALS: Social[] = [
  {
    href: 'https://twitter.com/jackyef__',
    label: 'Twitter',
    icon: <TwitterIcon size={14} aria-hidden="true" />,
  },
  {
    href: 'https://github.com/jackyef',
    label: 'GitHub',
    icon: <GithubIcon size={14} aria-hidden="true" />,
  },
  {
    href: 'https://linkedin.com/in/jackyef',
    label: 'LinkedIn',
    icon: <LinkedinIcon size={14} aria-hidden="true" />,
  },
  {
    href: 'mailto:hello@jackyef.com',
    label: 'Email',
    icon: <MailIcon size={14} aria-hidden="true" />,
  },
];
