import { useEffect } from 'react';

import { H2 } from '@/components/Typography/Heading';

const OpenerPage = () => {
  useEffect(() => {
    if (window.opener) {
      window.opener.location = '/?status=redirected';
    }
  });

  return <H2>Go back to previous tab, it should be redirected now!</H2>;
};

export default OpenerPage;
