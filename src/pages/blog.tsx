import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next/types';

import { Post } from '@/blog/types';
import { getPosts } from '@/blog/getPosts';
import { PostRow } from '@/components/Blog/PostRow';
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

  return (
    <>
      <PageMetaTags title="Blog" />

      <div className="page-pad">
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          Writing
        </p>
        <h1 className="page-title" style={{ marginBottom: 32 }}>
          {tags.length > 0 ? (
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
          )}
        </h1>

        {tags.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <a
              href="/blog"
              style={{
                fontSize: 13,
                color: 'var(--color-accent-text)',
                textDecoration: 'none',
              }}
              className="hover:underline"
            >
              ← Clear filter
            </a>
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
