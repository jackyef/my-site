import { useRouter } from 'next/router';

import { WaveBackground } from '../Background/WaveBackground';

export const PageContainer: React.FC = ({ children }) => {
  const router = useRouter();

  return (
    <div>
      <WaveBackground hidden={router.pathname !== '/'} />
      {children}
    </div>
  );
};
