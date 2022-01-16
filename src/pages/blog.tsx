import { Flipped } from 'react-flip-toolkit';

import { PageTitle } from '../components/Typography/PageTitle';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';
import { EmojiSpan } from '@/components/Typography/EmojiSpan';

export default function Home() {
  return (
    <>
      <PageMetaTags />
      <Flipped flipId="latest-writing-heading" spring="noWobble" translate>
        {(flippedProps) => (
          <PageTitle {...flippedProps}>
            Latest writings <EmojiSpan>✍️</EmojiSpan>
          </PageTitle>
        )}
      </Flipped>
      <PostPreviewList />
    </>
  );
}
