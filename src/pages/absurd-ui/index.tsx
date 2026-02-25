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

        <GlassPane className="p-8 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4 flex-1 justify-center">
            <div
              style={{
                fontSize: '4.5rem',
                lineHeight: 1,
                filter:
                  'drop-shadow(0 0 16px rgba(99,102,241,0.5)) drop-shadow(0 0 32px rgba(99,102,241,0.2))',
              }}
            >
              🎮
            </div>
            <p className="text-sm text-theme-subtitle text-center max-w-xs leading-relaxed">
              A Steam Big Picture–inspired full-screen experience. Navigate with
              a game controller, keyboard, or mouse.
            </p>
          </div>
          <div>
            <InternalLink href="/absurd-ui/big-picture">
              Big Picture Mode
            </InternalLink>
          </div>
        </GlassPane>
      </div>
    </>
  );
}
