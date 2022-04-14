import { Fragment } from 'react';
import { IOLazyFeedbackFish } from '@/components/FeedbackFish/Lazy';
import clsx from 'clsx';
import { css } from 'goober';
import { SectionContainer } from '../SectionContainer';
import Link, { LinkProps } from 'next/link';

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
        label: 'Blog',
        href: '/blog',
      },
      {
        label: 'About',
        href: '/about',
      },
      {
        label: 'Speech-to-text',
        href: '/tools/speech-to-text',
      },
    ],
  },
];

export const Footer = () => {
  const feedbackButton = css`
    --text-lightness: calc(var(--l-primary) - 12%);

    [data-theme='dark'] & {
      --text-lightness: var(--l-primary);
    }

    color: hsl(var(--h-primary) var(--s-primary) var(--text-lightness));
    background: hsla(var(--h-primary) var(--s-primary) var(--l-primary) / 0.1);
    border-color: hsl(var(--h-primary) var(--s-primary) var(--l-primary));
    border-radius: 0.5rem;

    &:hover,
    &:focus {
      background: hsla(
        var(--h-primary) var(--s-primary) var(--l-primary) / 0.08
      );
    }
  `;

  return (
    <footer
      className={clsx(
        'text-sm',
        'py-16',
        'mt-20',
        'border-t-2',
        'border-theme-backgroundOffset',
        css`
          background-color: rgba(var(--rgb-bg-offset), 0.1);
        `,
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
                  <h4 className={clsx('text-2xl', 'text-theme-heading')}>
                    {section.sectionTitle}
                  </h4>
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
            <button className={clsx('px-4', 'py-2', feedbackButton)}>
              Got feedback?
            </button>
          </IOLazyFeedbackFish>
        </div>
      </SectionContainer>
    </footer>
  );
};
