import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next/types';

import { Post } from '@/blog/types';
import { getPosts } from '@/blog/getPosts';
import { PostRow } from '@/components/Blog/PostRow';
import { PageHeader } from '@/components/common/PageHeader';
import { TextLink } from '@/components/common/TextLink';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';

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

  const title =
    tags.length > 0 ? (
      <>
        Posts tagged{' '}
        <em>
          {tags.map((t, i) => (
            <Fragment key={t}>
              {t}
              {i < tags.length - 1 ? ', ' : ''}
            </Fragment>
          ))}
        </em>
      </>
    ) : (
      <>
        All <em>posts.</em>
      </>
    );

  return (
    <>
      <PageMetaTags title="Blog" />

      <div className="page-pad">
        <PageHeader eyebrow="Writing" title={title} />

        {tags.length > 0 && (
          <div className="mb-4">
            <TextLink className="text-[13px]" href="/blog">
              ← Clear filter
            </TextLink>
          </div>
        )}

        <div>
          {filteredPosts.map((post) => (
            <PostRow key={post.link} post={post} />
          ))}
        </div>
      </div>
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
