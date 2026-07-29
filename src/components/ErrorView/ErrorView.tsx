import { NextPage } from 'next';

import { IOLazyFeedbackFish } from '@/components/FeedbackFish/Lazy';
import { Heading } from '@/components/common/Heading';
import { PageHeader } from '@/components/common/PageHeader';
import { InternalLink } from '@/components/Typography/InternalLink';

import { PageMetaTags } from '../Seo/PageMetaTags';

interface Props {
  statusCode?: number;
}

export const ErrorView: NextPage<Props> = ({ statusCode = 500 }) => {
  return (
    <>
      <PageMetaTags title={`${statusCode}: Something went wrong!`} />
      <main className="my-32 page-pad">
        <PageHeader
          title="Whoops, something went wrong!"
          titleSpacing="mb-12"
        />
        <Heading level={2}>
          It would be awesome if you could help{' '}
          <IOLazyFeedbackFish>
            <button className="font-bold text-(--color-accent-text) cursor-pointer">
              reporting
            </button>
          </IOLazyFeedbackFish>{' '}
          what just happened before you encountered this error.
        </Heading>
        <div className="mt-12" />
        <Heading level={2}>
          <InternalLink href="/">&larr; Go back home</InternalLink>
        </Heading>
      </main>
    </>
  );
};
