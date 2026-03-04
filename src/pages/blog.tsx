import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next/types';

import { WritingItem } from '@/blog/types';
import { getPosts } from '@/blog/getPosts';
import { mergeWritings } from '@/blog/writings';
import { PostRow } from '@/components/Blog/PostRow';
import { PageHeader } from '@/components/common/PageHeader';
import { TextLink } from '@/components/common/TextLink';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';

type Props = {
  writings: WritingItem[];
};

export default function BlogPage({ writings }: Props) {
  const router = useRouter();
  const tags = router.query.tags ? String(router.query.tags).split(',') : [];

  const filteredWritings =
    tags.length > 0
      ? writings.filter((item) => {
          return tags.some((tag) => item.tags.includes(tag));
        })
      : writings;

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
        All <em>writings.</em>
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
          {filteredWritings.map((item) => (
            <PostRow key={item.link} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getPosts({ limit: 0, onlyPreview: true });

  return {
    props: {
      writings: mergeWritings(posts),
    },
  };
};
