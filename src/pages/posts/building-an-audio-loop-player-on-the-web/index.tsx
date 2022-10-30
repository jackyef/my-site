import { GetStaticProps } from 'next/types';

import { getPostBySlug } from '@/blog/getPosts';
import { Post as PostType } from '@/blog/types';
import Post from '@/components/Blog/Post/Post';

type Props = {
  post: PostType;
};

const PostPage = ({ post }: Props) => {
  return <Post post={post} />;
};

export default PostPage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      post: await getPostBySlug('building-an-audio-loop-player-on-the-web'),
    },
  };
};
