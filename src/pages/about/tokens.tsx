import path from 'path';

import { GetStaticProps } from 'next/types';

import { getPost } from '@/blog/getPosts';
import { Post as PostType } from '@/blog/types';
import Post from '@/components/Blog/Post/Post';

type Props = {
  post: PostType;
};

const TokensPage = ({ post }: Props) => {
  return <Post post={post} />;
};

export default TokensPage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const filePath = path.join(process.cwd(), 'src/pages/about/tokens.mdx');

  return {
    props: {
      post: await getPost(filePath),
    },
  };
};
