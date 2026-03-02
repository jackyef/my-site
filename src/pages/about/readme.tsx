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
    <div className="page-pad">
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
