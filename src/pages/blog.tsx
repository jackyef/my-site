import { useRouter } from 'next/router';
import { Flipped } from 'react-flip-toolkit';
import { Fragment } from 'react';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';
import { EmojiSpan } from '@/components/Typography/EmojiSpan';
import { Tag } from '@/components/common/Tag';

import { PageTitle } from '../components/Typography/PageTitle';

const Tags = ({ tags = [] }: { tags: string[] }) => {
  if (tags.length === 0) return null;

  return (
    <div className="inline-flex space-x-4 items-center">
      <span>in</span>
      {tags.map((tag, i) => {
        return (
          <Fragment key={i}>
            <Tag variant="secondary">{tag}</Tag>
            {i !== tags.length - 1 ? ',' : ''}
          </Fragment>
        );
      })}
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const tags = router.query.tags ? String(router.query.tags).split(',') : [];

  return (
    <>
      <PageMetaTags />
      <Flipped flipId="latest-writing-heading" spring="noWobble" translate>
        {(flippedProps) => (
          <PageTitle {...flippedProps}>
            Latest writings <Tags tags={tags} /> <EmojiSpan>✍️</EmojiSpan>
          </PageTitle>
        )}
      </Flipped>
      <PostPreviewList tags={tags} />
    </>
  );
}
