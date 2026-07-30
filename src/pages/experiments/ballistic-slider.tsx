import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { PageHeader } from '@/components/common/PageHeader';
import { Surface } from '@/components/common/Surface';
import { Text } from '@/components/common/Text';
import { BallisticSlider } from '@/components/experiments/BallisticSlider';
import { getExperiment } from '@/components/experiments/constants';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { InternalLink } from '@/components/Typography/InternalLink';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

const experiment = getExperiment('ballistic-slider');

export const meta = {
  title: experiment.title,
  description: experiment.description,
  image: createOgImageUrl({
    title: experiment.title,
  }),
  date: experiment.date,
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
      <PageHeader eyebrow="Lab" title={meta.title} />

      <Text color="ink-2" className="mb-6">
        A slider with some ballistic physics baked in. Drag the icon and aim to
        set the value.{' '}
        <InternalLink href="/experiments">View all experiments</InternalLink>.
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
