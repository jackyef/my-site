import tinytime from 'tinytime';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { createOgImageUrl } from '@/utils/createOgImageUrl';
import { PageTitle } from '@/components/Typography/PageTitle';
import { ClaymorphismTools } from '@/components/tools/Claymorphism';
import { HorizontalDivider } from '@/components/Divider';
import { Paragraph } from '@/components/Typography/Paragraph';
import { ExternalLink } from '@/components/Typography/ExternalLink';
import { SectionTitle } from '@/components/Typography/SectionTitle';

const meta = {
  title: 'Claymorphism CSS generator',
  description: 'Play around and generate a claymorphism style CSS!',
  image: createOgImageUrl({
    title: 'Claymorphism CSS generator',
    fontSize: 120,
  }),
  date: '2021-12-22T09:45:30.326Z',
};

const postDateTemplate = tinytime('{MM} {DD}, {YYYY}');

const ClaymorphismToolsPage = () => {
  return (
    <>
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
        publishDate={postDateTemplate.render(new Date(meta.date))}
      />

      <PageTitle>{meta.title}</PageTitle>

      <HorizontalDivider />

      <ClaymorphismTools />

      <HorizontalDivider />

      <SectionTitle>References</SectionTitle>

      <Paragraph>
        <ExternalLink href="https://uxdesign.cc/claymorphism-in-user-interfaces-1757fabaa377">
          Claymorphism in User Interfaces – Michal Malewicz
        </ExternalLink>
      </Paragraph>
    </>
  );
};

export default ClaymorphismToolsPage;
