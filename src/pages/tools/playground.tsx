import tinytime from 'tinytime';
import * as LZString from 'lz-string';
import { useEffect, useState } from 'react';

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
    <>
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
        publishDate={postDateTemplate.render(new Date(meta.date))}
      />
      <PageTitle>{meta.title}</PageTitle>

      <HorizontalDivider />

      {isInitialized && <CodePlayground initialCode={initialCode} />}
    </>
  );
};

export default PlaygroundPage;
