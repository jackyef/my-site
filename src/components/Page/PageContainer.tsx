import { useRouter } from 'next/router';

import { SectionContainer } from '@/components/SectionContainer';

import { Hero } from '../Hero';

export const PageContainer: React.FC = ({ children }) => {
  const router = useRouter();

  return (
    <div>
      <Hero hidden={router.pathname !== '/'} />
      <SectionContainer>
        <div className="pt-12">{children}</div>
      </SectionContainer>
    </div>
  );
};
