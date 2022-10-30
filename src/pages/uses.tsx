import path from 'path';

import { GetStaticProps } from 'next/types';

import { getPost } from '@/blog/getPosts';
import { Post as PostType } from '@/blog/types';
import Post from '@/components/Blog/Post/Post';

type Props = {
  post: PostType;
};

const UsesPage = ({ post }: Props) => {
  return <Post post={post} />;
};

export default UsesPage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const filePath = path.join(process.cwd(), 'src/pages/uses.mdx');

  return {
    props: {
      post: await getPost(filePath),
    },
  };
};
