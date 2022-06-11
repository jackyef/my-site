import { useRouter } from 'next/router';
import { Flipped } from 'react-flip-toolkit';

import { PageTitle } from '../components/Typography/PageTitle';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';
import { EmojiSpan } from '@/components/Typography/EmojiSpan';

export default function Home() {
  const router = useRouter();
  const tags = router.query.tags ? String(router.query.tags).split(',') : [];

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
      <PostPreviewList tags={tags} />
    </>
  );
}
