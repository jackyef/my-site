import * as LZString from 'lz-string';
import { useEffect, useState } from 'react';

import { CodePlayground } from '@/components/CodePlayground/CodePlayground';
import { PageHeader } from '@/components/common/PageHeader';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';

import { createOgImageUrl } from '@/utils/createOgImageUrl';
import { formatPostDate } from '@/lib/datetime';

export const meta = {
  title: 'Code playground',
  description:
    'A playground for testing code snippets with framer-motion and tailwind css',
  image: createOgImageUrl({
    title: 'Code playground',
  }),
  date: '2023-07-05T09:45:30.326Z',
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
      <PageHeader eyebrow="Tools" title={meta.title} />

      {isInitialized && <CodePlayground initialCode={initialCode} />}
    </div>
  );
};

export default PlaygroundPage;
