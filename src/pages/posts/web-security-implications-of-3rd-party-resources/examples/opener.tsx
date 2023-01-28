import { useEffect, useState } from 'react';

import { H2 } from '@/components/Typography/Heading';
import { Paragraph } from '@/components/Typography/Paragraph';

const OpenerPage = () => {
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (window.opener) {
      window.opener.location = '/?status=redirected';
      setHasRedirected(true);
    }
  }, []);

  return (
    <>
      <H2>
        This page was opened using <code>window.open()</code>
      </H2>

      {hasRedirected ? (
        <Paragraph>
          Go back to previous tab, it should be redirected now!
          <br />
          <br />
          You can now close this tab.
        </Paragraph>
      ) : (
        <Paragraph>Trying to redirect the opener page...</Paragraph>
      )}
    </>
  );
};

export default OpenerPage;
