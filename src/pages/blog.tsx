import { PageTitle } from '../components/Typography/PageTitle';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';

export default function Home() {
  return (
    <>
      <PageMetaTags />
      <PageTitle>Blog ✍️</PageTitle>
      <PostPreviewList />
    </>
  );
}
