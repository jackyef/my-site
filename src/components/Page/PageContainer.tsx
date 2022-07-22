import { useRouter } from 'next/router';

import { SectionContainer } from '@/components/SectionContainer';

import { Hero } from '../Hero';

interface Props {
  children?: React.ReactNode;
}

export const PageContainer = ({ children }: Props) => {
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
