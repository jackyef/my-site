import { Heading } from '@/components/common/Heading';
import { PageHeader } from '@/components/common/PageHeader';
import { Text } from '@/components/common/Text';
import { ClaymorphismTools } from '@/components/experiments/Claymorphism';
import { getExperiment } from '@/components/experiments/constants';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { ExternalLink } from '@/components/Typography/ExternalLink';
import { formatPostDate } from '@/lib/datetime';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

const experiment = getExperiment('claymorphism');

export const meta = {
  title: experiment.title,
  description: experiment.description,
  image: createOgImageUrl({
    title: experiment.title,
  }),
  date: experiment.date,
};

const ClaymorphismToolsPage = () => {
  return (
    <div className="page-pad">
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
        publishDate={formatPostDate(meta.date)}
      />

      <PageHeader eyebrow="Lab" title={meta.title} />

      <ClaymorphismTools />

      <Heading level={4} className="mt-8 mb-4">
        References
      </Heading>
      <Text color="ink-2" className="md:text-lg">
        <ExternalLink href="https://uxdesign.cc/claymorphism-in-user-interfaces-1757fabaa377">
          Claymorphism in User Interfaces – Michal Malewicz
        </ExternalLink>
      </Text>
    </div>
  );
};

export default ClaymorphismToolsPage;
