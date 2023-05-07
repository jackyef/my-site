import tinytime from 'tinytime';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PageTitle } from '@/components/Typography/PageTitle';
import { HorizontalDivider } from '@/components/Divider';
import { CodePlayground } from '@/components/CodePlayground/CodePlayground';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

export const meta = {
  title: 'Code playground',
  description:
    'A playground for testing code snippets with framer-motion and tailwind css',
  image: createOgImageUrl({
    title: 'Code playground',
  }),
  date: '2023-07-05T09:45:30.326Z',
};

const postDateTemplate = tinytime('{MM} {DD}, {YYYY}');

const PlaygroundPage = () => {
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

      <CodePlayground />
    </>
  );
};

export default PlaygroundPage;
