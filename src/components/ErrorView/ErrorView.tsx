import { NextPage } from 'next';

import { IOLazyFeedbackFish } from '@/components/FeedbackFish/Lazy';
import { InternalLink } from '@/components/Typography/InternalLink';
import { PageTitle } from '@/components/Typography/PageTitle';
import { SectionTitle } from '@/components/Typography/SectionTitle';
import { PageMetaTags } from '../Seo/PageMetaTags';

interface Props {
  statusCode?: number;
}

export const ErrorView: NextPage<Props> = ({ statusCode = 500 }) => {
  return (
    <>
      <PageMetaTags title={`${statusCode}: Something went wrong!`} />
      <main className="my-32">
        <PageTitle>Whoops, something went wrong!</PageTitle>
        <div className="mt-12" />
        <SectionTitle>
          It would be awesome if you could help{' '}
          <IOLazyFeedbackFish>
            <button className="font-bold text-theme-link">reporting</button>
          </IOLazyFeedbackFish>{' '}
          what just happened before you encountered this error. 🙇‍♂️
        </SectionTitle>
        <div className="mt-12" />
        <SectionTitle>
          <InternalLink href="/">&larr; Go back home</InternalLink>
        </SectionTitle>
      </main>
    </>
  );
};
