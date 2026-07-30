import Link from 'next/link';

import { PageHeader } from '@/components/common/PageHeader';
import { Surface } from '@/components/common/Surface';
import { Text } from '@/components/common/Text';
import {
  EXPERIMENTS,
  experimentHref,
} from '@/components/experiments/constants';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { formatPostDate } from '@/lib/datetime';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

export const meta = {
  title: 'Lab',
  description:
    'Half-finished ideas, generators and impractical components — the things I built to answer a question rather than to ship.',
  image: createOgImageUrl({
    title: 'Lab',
  }),
  date: '2021-12-22T09:45:30.326Z',
};

export default function LabPage() {
  return (
    <div className="page-pad">
      <PageMetaTags
        title={meta.title}
        description={meta.description}
        image={meta.image}
      />
      <PageHeader
        eyebrow="Lab"
        title={
          <>
            Things I built <em>to find out</em>
          </>
        }
        titleSpacing="mb-4"
      />

      <Text variant="lead" color="ink-2" className="mb-8 max-w-[62ch]">
        Generators, browser API demos and components no one should ship — each
        one started as a question rather than a plan. Nothing here is meant for
        production; play with it anyway.
      </Text>

      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 list-none p-0 m-0">
        {EXPERIMENTS.map(({ slug, label, description, date, icon: Icon }) => (
          <li key={slug} className="flex">
            <Link
              href={experimentHref(slug)}
              className="group flex-1 no-underline"
            >
              <Surface
                elevation="sm"
                className="card-hover h-full p-5 flex items-start gap-4"
              >
                <span className="shrink-0 flex items-center justify-center size-9 rounded-lg bg-(--color-bg-hover) text-(--color-accent-text)">
                  <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="block text-[15px] font-medium text-(--color-ink) leading-[1.5] group-hover:text-(--color-accent-text)">
                    {label}
                  </span>
                  <Text as="span" variant="body-sm" className="block mt-1">
                    {description}
                  </Text>
                  <Text as="span" variant="caption-sm" className="block mt-2">
                    {formatPostDate(date)}
                  </Text>
                </span>
              </Surface>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
