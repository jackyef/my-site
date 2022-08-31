import { ExternalLink } from '@/components/Typography/ExternalLink';
import { InternalLink } from '@/components/Typography/InternalLink';
import { sendEventTracker } from '@/utils/analytics/tracker';

interface Props {
  isExternalSource: false | true;
  link: string;
  title?: string;
  pathname?: string;
  source?: string;
}

export const CheckSourceArticle: React.FC<Props> = ({
  isExternalSource,
  link,
  title,
  pathname,
  source,
}) => {
  if (isExternalSource) {
    return (
      <ExternalLink href={link}>
        Read {source ? 'on ' + source : 'More'} &rarr;
      </ExternalLink>
    );
  } else {
    return (
      <InternalLink
        href={link}
        aria-label={`Read "${title}"`}
        onClick={() => {
          sendEventTracker({
            name: 'click',
            category: `${pathname} - post preview read more`,
            label: title,
          });
        }}
      >
        Read more &rarr;
      </InternalLink>
    );
  }
};
