import { useEffect, useState } from 'react';

import { H2 } from '@/components/Typography/Heading';

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
        <p className="text-md md:text-lg my-6">
          Go back to previous tab, it should be redirected now!
          <br />
          <br />
          You can now close this tab.
        </p>
      ) : (
        <p className="text-md md:text-lg my-6">
          Trying to redirect the opener page...
        </p>
      )}
    </>
  );
};

export default OpenerPage;
