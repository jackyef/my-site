import { useState } from 'react';

import { BallisticSlider } from '@/components/absurd-components/BallisticSlider';
import { LightButton } from '@/components/common/Button/LightButton';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { HorizontalDivider } from '@/components/Divider';
import { GlassPane } from '@/components/common/GlassPane';
import Breadcrumbs from '@/components/common/Breadcrumbs';

import { createOgImageUrl } from '@/utils/createOgImageUrl';
import { cn } from '@/utils/styles/classNames';

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
    <>
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
      />
      <Breadcrumbs
        pages={[
          { name: 'Absurd UIs', href: '/absurd-ui' },
          {
            name: 'Ballistic Slider',
            href: '/absurd-ui/ballistic-slider',
            current: true,
          },
        ]}
      />

      <HorizontalDivider />

      <GlassPane
        className={cn(
          'px-8 pb-8 flex flex-col w-[412px] max-w-full mx-auto items-center',
        )}
      >
        <div className="w-full pt-12">
          <BallisticSlider height={200} debug={debug} />
        </div>
        <LightButton onClick={() => setDebug((prev) => !prev)}>
          Debug mode: {String(debug)}
        </LightButton>
      </GlassPane>
    </>
  );
}
