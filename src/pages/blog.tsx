import { Flipped } from 'react-flip-toolkit';

import { PageTitle } from '../components/Typography/PageTitle';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';

export default function Home() {
  return (
    <>
      <PageMetaTags />
      <Flipped flipId="latest-writing-heading" spring="noWobble" translate>
        {(flippedProps) => (
          <PageTitle {...flippedProps}>Latest writings ✍️</PageTitle>
        )}
      </Flipped>
      <PostPreviewList />
    </>
  );
}
