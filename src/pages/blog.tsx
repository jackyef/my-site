import { PageTitle } from '../components/Typography/PageTitle';
import { PageContainer } from '../components/Page/PageContainer';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';
import { PostPreviewList } from '@/components/Blog/Post/PostPreviewList';

export default function Home() {
  return (
    <PageContainer>
      <PageMetaTags />
      <PageTitle>Blog ✍️</PageTitle>
      <PostPreviewList />
    </PageContainer>
  );
}
