import { ArrowUpRight } from 'lucide-react';

import { MessyCarousel, MessyCarouselItem } from '@/components/about/MessyCarousel';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import MediumStories from '@/components/Medium/medium-stories.json';

function getPublication(url: string): string {
  try {
    const path = new URL(url).pathname.split('/')[1];
    if (path?.startsWith('@')) return 'Personal';
    return (path ?? '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  } catch {
    return 'Medium';
  }
}

export function WritingView() {
  return (
    <div className="page-pad">
      <PageHeader
        eyebrow="Writing"
        title={
          <>
            External <em>publications.</em>
          </>
        }
      />

      <MessyCarousel>
        {MediumStories.map((story, i) => (
          <MessyCarouselItem
            key={story.url}
            index={i}
            as="a"
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[280px] no-underline"
          >
            <Card hover className="overflow-hidden h-full flex flex-col relative">
              <div className="h-[140px] bg-(--color-bg-hover) overflow-hidden">
                <img
                  src={story.coverImage}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="px-[14px] py-[12px] flex flex-col flex-1">
                <div className="text-[14px] font-semibold text-(--color-ink) mb-2 leading-snug line-clamp-2">
                  {story.title}
                </div>

                <div className="flex items-center justify-between gap-1.5 text-[12px] text-(--color-ink-4) mt-auto">
                  <span>{getPublication(story.url)}</span>
                  <span>{story.timeToRead}</span>
                </div>
              </div>

              <div className="absolute top-2 right-2 bg-(--color-bg-panel)/80 backdrop-blur-sm rounded-full p-1">
                <ArrowUpRight
                  size={12}
                  aria-hidden="true"
                  className="text-(--color-ink-3)"
                />
              </div>
            </Card>
          </MessyCarouselItem>
        ))}
      </MessyCarousel>
    </div>
  );
}
