import { Heading } from '@/components/common/Heading';
import { Text } from '@/components/common/Text';
import { SOCIALS } from '@/constants/socials';

import { RESUME_TAGLINE } from './data';

const CONTACT_LABELS: Record<string, string> = {
  Email: 'hello@jackyef.com',
  GitHub: 'github.com/jackyef',
  LinkedIn: 'linkedin.com/in/jackyef',
  Twitter: '@jackyef__',
};

/**
 * Printed pages lose all the playful framing, so on paper the page leads
 * with the things a resume is actually expected to open with: who this
 * is, what they do, and how to reach them.
 */
export function PrintHeader() {
  return (
    <div className="mb-8 hidden print:block">
      <Heading level={1} className="mb-1">
        Jacky Efendi
      </Heading>
      <Text variant="body" color="ink-2">
        {RESUME_TAGLINE}
      </Text>
      <Text variant="caption" className="mt-2">
        Jakarta, Indonesia (UTC+7) · Remote
        {SOCIALS.map((social) => {
          const label = CONTACT_LABELS[social.label];
          return label ? ` · ${label}` : '';
        }).join('')}
      </Text>
    </div>
  );
}
