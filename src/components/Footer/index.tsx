import { Fragment } from 'react';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';

import { IOLazyFeedbackFish } from '@/components/FeedbackFish/Lazy';

import { SectionContainer } from '../SectionContainer';
import { LightButton } from '../common/Button/LightButton';

type FooterLink = {
  label: string;
  href: string;
  type?: 'external';
  rel?: string;
};

type FooterSection = {
  sectionTitle: string;
  links: FooterLink[];
};

const FOOTER_LINKS: FooterSection[] = [
  {
    sectionTitle: 'Social',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/jackyef/my-site',
        type: 'external',
      },
      {
        label: 'Twitter',
        href: 'https://twitter.com/jackyef__',
        rel: 'me',
        type: 'external',
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/jackyef/',
        rel: 'me',
        type: 'external',
      },
    ],
  },
  {
    sectionTitle: 'Navigation',
    links: [
      {
        label: 'About',
        href: '/about',
      },
      {
        label: 'Tokens',
        href: '/about/tokens',
      },
      {
        label: 'Uses',
        href: '/uses',
      },
    ],
  },
  {
    sectionTitle: 'Blog',
    links: [
      {
        label: 'All posts',
        href: '/blog',
      },
      {
        label: 'Tech',
        href: '/blog?tags=tech',
      },
      {
        label: 'Career',
        href: '/blog?tags=career',
      },
      {
        label: 'Life',
        href: '/blog?tags=life',
      },
    ],
  },
];

export const Footer = () => {
  return (
    <footer
      className={clsx(
        'text-sm',
        'py-16',
        'mt-20',
        'border-t-2',
        'border-surface-0',
        'bg-surface-3',
      )}
    >
      <SectionContainer>
        <div
          className={clsx(
            'flex',
            'flex-col',
            'justify-between',
            'sm:flex-row',
            'sm:space-y-0',
            'space-y-12',
          )}
        >
          <div
            className={clsx(
              'flex',
              'flex-col',
              'sm:flex-row',
              'sm:space-x-32',
              'sm:space-y-0',
              'space-y-12',
            )}
          >
            {FOOTER_LINKS.map((section) => {
              return (
                <div
                  key={section.sectionTitle}
                  className={clsx('flex', 'flex-col', 'space-y-4')}
                >
                  <h3 className={clsx('text-2xl', 'text-theme-heading')}>
                    {section.sectionTitle}
                  </h3>
                  <ul
                    className={clsx(
                      'text-theme-subtitle',
                      'flex',
                      'flex-col',
                      'space-y-1',
                    )}
                  >
                    {section.links.map((link) => {
                      const Wrapper =
                        link.type !== 'external' ? Link : Fragment;
                      const wrapperProps =
                        Wrapper === Fragment
                          ? ({} as LinkProps)
                          : {
                              href: link.href,
                              passHref: true,
                            };

                      return (
                        <li key={link.href}>
                          <Wrapper {...wrapperProps}>
                            <a
                              href={link.href}
                              rel={link.rel}
                              className="hover:text-theme-text"
                            >
                              {link.label}
                            </a>
                          </Wrapper>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <IOLazyFeedbackFish>
            <LightButton>Got feedback?</LightButton>
          </IOLazyFeedbackFish>
        </div>
      </SectionContainer>
    </footer>
  );
};
