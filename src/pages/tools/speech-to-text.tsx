import tinytime from 'tinytime';

import { HorizontalDivider } from '@/components/Divider';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { WebSpeechAPIDemo } from '@/components/tools/WebSpeechAPIDemo';
import { PageTitle } from '@/components/Typography/PageTitle';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

export const meta = {
  title: 'Speech-to-text with Web Speech API',
  description:
    "Speech-to-text demo using the Web Speech API's SpeechRecognition",
  image: createOgImageUrl({
    title: 'Speech-to-text with Web Speech API',
  }),
  date: '2022-04-13T06:43:37.680Z',
};

const postDateTemplate = tinytime('{MM} {DD}, {YYYY}');

const SpeechToolsPage = () => {
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

      <WebSpeechAPIDemo />
    </>
  );
};

export default SpeechToolsPage;
