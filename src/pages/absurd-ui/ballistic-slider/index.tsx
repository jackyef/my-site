import { useState } from 'react';

import { BallisticSlider } from '@/components/absurd-components/BallisticSlider';
import { Button } from '@/components/common/Button';
import { PageHeader } from '@/components/common/PageHeader';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { Text } from '@/components/common/Text';
import { InternalLink } from '@/components/Typography/InternalLink';
import { Surface } from '@/components/common/Surface';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

export const meta = {
  title: 'Absurd UI – Ballistic Slider',
  description: 'A slider with some ballistic physics baked in.',
  image: createOgImageUrl({
    title: 'Absurd UI – Ballistic Slider',
  }),
  date: '2024-03-10T09:45:30.326Z',
};

export default function BallisticSliderPage() {
  const [debug, setDebug] = useState(false);

  return (
    <div className="page-pad">
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
      />
      <PageHeader eyebrow="Absurd UI" title="Ballistic Slider" />

      <Text color="ink-2" className="mb-6">
        A slider with some ballistic physics baked in. Drag the icon and aim to
        set the value.{' '}
        <InternalLink href="/absurd-ui">View all experiments</InternalLink>.
      </Text>

      <Surface
        elevation="sm"
        className="p-8 flex flex-col w-[412px] max-w-full items-center"
      >
        <div className="w-full pt-4">
          <BallisticSlider height={200} debug={debug} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDebug((prev) => !prev)}
        >
          Debug mode: {String(debug)}
        </Button>
      </Surface>
    </div>
  );
}
