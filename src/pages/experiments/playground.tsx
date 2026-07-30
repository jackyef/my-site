import * as LZString from 'lz-string';
import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/common/PageHeader';
import { CodePlayground } from '@/components/experiments/CodePlayground/CodePlayground';
import { getExperiment } from '@/components/experiments/constants';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { formatPostDate } from '@/lib/datetime';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

const experiment = getExperiment('playground');

export const meta = {
  title: experiment.title,
  description: experiment.description,
  image: createOgImageUrl({
    title: experiment.title,
  }),
  date: experiment.date,
};

const PlaygroundPage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialCode, setInitialCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    const compressedCodeFromHash =
      typeof window !== 'undefined'
        ? window.location.hash.replace('#code=', '')
        : '';

    setInitialCode(
      compressedCodeFromHash
        ? LZString.decompressFromEncodedURIComponent(compressedCodeFromHash)
        : undefined,
    );

    setIsInitialized(true);
  }, []);

  return (
    <div className="page-pad">
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
        publishDate={formatPostDate(meta.date)}
      />
      <PageHeader eyebrow="Lab" title={meta.title} />

      {isInitialized && <CodePlayground initialCode={initialCode} />}
    </div>
  );
};

export default PlaygroundPage;
