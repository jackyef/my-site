import { PageMetaTags } from '../Seo/PageMetaTags';
import { InternalLink } from '../Typography/InternalLink';
import { PageTitle } from '../Typography/PageTitle';
import { SectionTitle } from '../Typography/SectionTitle';

export const Error404View = () => {
  return (
    <>
      <PageMetaTags title="404: Not found" />
      <main className="my-32">
        <PageTitle>
          Whoops, there doesn&apos;t seem to be anything here! 4️⃣0️⃣4️⃣
        </PageTitle>
        <div className="mt-12" />
        <SectionTitle>
          <InternalLink href="/">&larr; Go back home</InternalLink>
        </SectionTitle>
      </main>
    </>
  );
};
