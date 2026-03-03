import { BallisticSlider } from '@/components/absurd-components/BallisticSlider';
import { PageHeader } from '@/components/common/PageHeader';
import { Surface } from '@/components/common/Surface';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { InternalLink } from '@/components/Typography/InternalLink';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

export const meta = {
  title: 'Absurd UI components',
  description:
    'A collection of absurd UI components that are not practical but fun to play with.',
  image: createOgImageUrl({
    title: 'Absurd UI components',
  }),
  date: '2024-03-10T09:45:30.326Z',
};

export default function AbsurdUiPage() {
  return (
    <div className="page-pad">
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
      />
      <PageHeader eyebrow="Experiments" title={meta.title} />

      <p className="text-md text-(--color-ink-2) md:text-lg mb-6">
        This is a collection of absurd UI components that are not practical but
        fun to play with. They are built to be interactive and fun to play with.
        They are not meant to be used in production. They are made for fun brain
        exercises.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Surface elevation="sm" className="p-8 flex flex-col items-center">
          <div className="w-96 max-w-full">
            <BallisticSlider height={200} />
          </div>
          <div>
            <InternalLink href="/absurd-ui/ballistic-slider">
              Ballistic Slider
            </InternalLink>
          </div>
        </Surface>
      </div>
    </div>
  );
}
