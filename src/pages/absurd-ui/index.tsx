import { BallisticSlider } from '@/components/absurd-components/BallisticSlider';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PageTitle } from '@/components/Typography/PageTitle';
import { HorizontalDivider } from '@/components/Divider';
import { Paragraph } from '@/components/Typography/Paragraph';
import { GlassPane } from '@/components/common/GlassPane';
import { InternalLink } from '@/components/Typography/InternalLink';

import { createOgImageUrl } from '@/utils/createOgImageUrl';
import { cn } from '@/utils/styles/classNames';

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
    <>
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
      />
      <PageTitle>{meta.title}</PageTitle>

      <HorizontalDivider />

      <Paragraph>
        This is a collection of absurd UI components that are not practical but
        fun to play with. They are built to be interactive and fun to play with.
        They are not meant to be used in production. They are made for fun brain
        exercises.
      </Paragraph>

      <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6')}>
        <GlassPane className="p-8 flex flex-col items-center">
          <div className="w-96 max-w-full">
            <BallisticSlider height={200} />
          </div>
          <div>
            <InternalLink href="/absurd-ui/ballistic-slider">
              Ballistic Slider
            </InternalLink>
          </div>
        </GlassPane>
      </div>
    </>
  );
}
