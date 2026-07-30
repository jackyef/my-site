import { PageHeader } from '@/components/common/PageHeader';
import { getExperiment } from '@/components/experiments/constants';
import { WebSpeechAPIDemo } from '@/components/experiments/WebSpeechAPIDemo';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { formatPostDate } from '@/lib/datetime';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

const experiment = getExperiment('speech-to-text');

export const meta = {
  title: experiment.title,
  description: experiment.description,
  image: createOgImageUrl({
    title: experiment.title,
  }),
  date: experiment.date,
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

      <PageHeader eyebrow="Lab" title={meta.title} />

      <WebSpeechAPIDemo />
    </div>
  );
};

export default SpeechToolsPage;
