import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { SkipSSR } from '@/components/SkipSSR';
import { Paragraph } from '@/components/Typography/Paragraph';

const Content = ({ targetUrl }: { targetUrl: string }) => (
  <>
    Your user agent is {navigator.userAgent}.
    <Paragraph>
      You will be redirected to {targetUrl} in a few seconds...
    </Paragraph>
  </>
);

export default function BypassPage() {
  const router = useRouter();
  const targetUrl = String(router.query.targetUrl);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (targetUrl) {
      timeout = setTimeout(() => {
        const anchor = document.createElement('a');
        anchor.href = targetUrl;
        anchor.download = 'true';

        anchor.click();
      }, 3000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [targetUrl]);

  return (
    <>
      <SkipSSR fallback="Identifying...">
        <Content targetUrl={targetUrl} />
      </SkipSSR>
    </>
  );
}
