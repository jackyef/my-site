import getAllPostPreviews from './getAllPostPreviews';

export async function getStaticProps() {
  return {
    props: {
      posts: getAllPostPreviews().map((post: any) => ({
        title: post.module.meta.title,
        link: post.link,
      })),
    },
  };
}
