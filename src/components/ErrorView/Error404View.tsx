import { Heading } from '@/components/common/Heading';
import { PageHeader } from '@/components/common/PageHeader';

import { InternalLink } from '../Typography/InternalLink';
import { PageMetaTags } from '../Seo/PageMetaTags';

export const Error404View = () => {
  return (
    <>
      <PageMetaTags title="404: Not found" />
      <main className="page-pad">
        <PageHeader
          title="Whoops, there doesn't seem to be anything here!"
          titleSpacing="mb-12"
        />
        <Heading level={2}>
          <InternalLink href="/">&larr; Go back home</InternalLink>
        </Heading>
      </main>
    </>
  );
};
