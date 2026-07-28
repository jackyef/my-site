import Head from 'next/head';

import { SOCIALS } from '@/constants/socials';

import { publicUrl } from '@/utils/constants';

import { EXPERIENCE, RESUME_TAGLINE, SKILLS } from './data';

/**
 * A resume page is exactly what schema.org's Person type is for, and the
 * room itself is opaque to a crawler. Built from the same data the page
 * renders, so it can't drift.
 */
export function ResumeJsonLd() {
  const [current] = EXPERIENCE;
  const [currentRole] = current.roles;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jacky Efendi',
    url: `${publicUrl}/resume`,
    description: RESUME_TAGLINE,
    jobTitle: currentRole.title,
    worksFor: {
      '@type': 'Organization',
      name: current.company,
      url: current.url,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'ID',
    },
    knowsAbout: SKILLS,
    sameAs: SOCIALS.filter((social) => !social.href.startsWith('mailto:')).map(
      (social) => social.href,
    ),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        // JSON.stringify escapes the content; `<` is the only sequence
        // that could close the script tag early
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, '\\u003c'),
        }}
      />
    </Head>
  );
}
