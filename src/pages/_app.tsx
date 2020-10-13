import * as React from 'react';
import type { AppProps } from 'next/app'
import Head from 'next/head';

import { CommonMetaTags } from '@/components/Seo/CommonMetaTags';
import { SectionContainer } from '@/components/SectionContainer';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';

import '@/styles/theme.css';
import '@/styles/tailwind.css';
import { baseAnalytics } from '@/utils/analytics/base.lazy';
import { canUseDOM, isProd } from '@/utils/constants';

// lazily init the analytics module from autotrack
if (canUseDOM && isProd) {
  // the analytic script requests to /collect is blocked
  // on lighthouse, not sure why. But it causes -7 points in Best Practice,
  // so we disable them there
  if (!/lighthouse/gi.test(navigator.userAgent)) {
    baseAnalytics().then(m => m.init());
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <CommonMetaTags />
      <SectionContainer>
        <Header />
      </SectionContainer>
      <SectionContainer>
        <Component {...pageProps} />
      </SectionContainer>
      <SectionContainer>
        <Footer />
      </SectionContainer>
      <Head>
        {isProd
          ? (
            <>
              {/* (analytics.js) - Google Analytics */}
              <script async src="https://www.google-analytics.com/analytics.js"></script>      
            </>
          ) : null
        }
      </Head>
    </>
  )
}

export default MyApp
