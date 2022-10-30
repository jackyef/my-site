import { useRouter } from 'next/router';
import { Flipped } from 'react-flip-toolkit';
import { Fragment } from 'react';
import { GetStaticProps } from 'next/types';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';
import { EmojiSpan } from '@/components/Typography/EmojiSpan';
import { Tag } from '@/components/common/Tag';
import { getPosts } from '@/blog/getPosts';
import { Post } from '@/blog/types';

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

type Props = {
  posts: Post[];
};

export default function BlogPage({ posts }: Props) {
  const router = useRouter();
  const tags = router.query.tags ? String(router.query.tags).split(',') : [];

  const filteredPosts =
    tags.length > 0
      ? posts.filter((post) => {
          return tags.some((tag) => post.metadata.tags.includes(tag));
        })
      : posts;

  return (
    <>
      <PageMetaTags />
      <Flipped flipId="latest-writing-heading" spring="noWobble" translate>
        {(flippedProps: any) => (
          <PageTitle {...flippedProps}>
            Latest writings <Tags tags={tags} /> <EmojiSpan>✍️</EmojiSpan>
          </PageTitle>
        )}
      </Flipped>
      <PostPreviewList posts={filteredPosts} />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      posts: await getPosts({ limit: 0, onlyPreview: true }),
    },
  };
};
