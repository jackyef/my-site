import { PageHeader } from '@/components/common/PageHeader';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { WebSpeechAPIDemo } from '@/components/tools/WebSpeechAPIDemo';

import { createOgImageUrl } from '@/utils/createOgImageUrl';
import { formatPostDate } from '@/lib/datetime';

export const meta = {
  title: 'Speech-to-text with Web Speech API',
  description:
    "Speech-to-text demo using the Web Speech API's SpeechRecognition",
  image: createOgImageUrl({
    title: 'Speech-to-text with Web Speech API',
  }),
  date: '2022-04-13T06:43:37.680Z',
};

const SpeechToolsPage = () => {
  return (
    <div className="page-pad">
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
        publishDate={formatPostDate(meta.date)}
      />

      <PageHeader eyebrow="Tools" title={meta.title} />

      <WebSpeechAPIDemo />
    </div>
  );
};

export default SpeechToolsPage;
