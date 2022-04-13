import { HorizontalDivider } from '@/components/Divider';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { WebSpeechAPIDemo } from '@/components/tools/WebSpeechAPIDemo';
import { PageTitle } from '@/components/Typography/PageTitle';
import { createOgImageUrl } from '@/utils/createOgImageUrl';
import tinytime from 'tinytime';

const meta = {
  title: 'Speech-to-text demo with Web Speech API',
  description: 'Speak in English and get the text back',
  image: createOgImageUrl({
    title: '**Web Speech API Demo**',
    fontSize: 120,
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
