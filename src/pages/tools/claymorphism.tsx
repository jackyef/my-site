import tinytime from 'tinytime';

import { Heading } from '@/components/common/Heading';
import { PageHeader } from '@/components/common/PageHeader';
import { Text } from '@/components/common/Text';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { ClaymorphismTools } from '@/components/tools/Claymorphism';
import { ExternalLink } from '@/components/Typography/ExternalLink';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

export const meta = {
  title: 'Claymorphism-style CSS generator',
  description: 'Play around and generate claymorphism-style CSS!',
  image: createOgImageUrl({
    title: 'Claymorphism-style CSS generator',
  }),
  date: '2021-12-22T09:45:30.326Z',
};

const postDateTemplate = tinytime('{MM} {DD}, {YYYY}');

const ClaymorphismToolsPage = () => {
  return (
    <div className="page-pad">
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
        publishDate={postDateTemplate.render(new Date(meta.date))}
      />

      <PageHeader eyebrow="Tools" title={meta.title} />

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
