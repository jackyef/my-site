import { ArrowUpRight } from 'lucide-react';

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

      <div className="flex flex-col gap-3">
        {MediumStories.map((story) => (
          <a
            key={story.url}
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <Card
              hover
              className="flex items-start gap-4 px-4.5 py-4"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-(--color-ink) mb-1 leading-snug">
                  {story.title}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-(--color-ink-4)">
                  <span>{getPublication(story.url)}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{story.timeToRead}</span>
                  {story.claps && (
                    <>
                      <span aria-hidden="true">&middot;</span>
                      <span>{story.claps} claps</span>
                    </>
                  )}
                </div>
              </div>

              <ArrowUpRight
                size={14}
                aria-hidden="true"
                className="text-(--color-ink-4) shrink-0 mt-0.5"
              />
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
