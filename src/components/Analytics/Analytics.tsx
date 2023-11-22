import Head from 'next/head';
import Script from 'next/script';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

import { isProd } from '@/utils/constants';

export const Analytics = () => {
  return isProd ? (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-6CK1QFKMHJ"
      ></Script>
      <Head>
        {/* Global site tag (gtag.js) - Google Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-6CK1QFKMHJ');`,
          }}
        ></script>
      </Head>

      {/* TODO: Trying this out for now. Might remove later */}
      <VercelAnalytics />
    </>
  ) : null;
};
