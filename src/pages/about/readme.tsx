import path from 'path';

import { GetStaticProps } from 'next/types';

import { getPost } from '@/blog/getPosts';
import { Post as PostType } from '@/blog/types';
import { MDXProvider } from '@/components/common/MDX';
import { PageHeader } from '@/components/common/PageHeader';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';

type Props = {
  post: PostType;
};

const ReadmePage = ({ post }: Props) => {
  const { metadata: meta } = post;

  return (
    // .post-pad and the post's own column width, not .page-pad. This is a long
    // read set in the same prose styles as a blog post, and .page-pad's 880px
    // is sized for the galleries — /design's cards and grids — which put their
    // running text in narrower blocks inside it. Applied here it gave this page
    // a 776px measure against a post's 636px: the widest lines on the site, on
    // the page that least wanted them.
    <div className="post-pad max-w-[740px] mx-auto">
      <PageMetaTags title={meta.title} description={meta.description} />
      <PageHeader eyebrow="About" title="README" titleSpacing="mb-6" />

      <div className="prose max-w-none">
        <MDXProvider mdxSource={post.mdxSource} />
      </div>
    </div>
  );
};

export default ReadmePage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const filePath = path.join(process.cwd(), 'src/pages/about/readme.mdx');

  return {
    props: {
      post: await getPost(filePath),
    },
  };
};
