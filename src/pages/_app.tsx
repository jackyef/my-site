import * as React from 'react';
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Flipper } from 'react-flip-toolkit';

import { CommonMetaTags } from '@/components/Seo/CommonMetaTags';
import { SectionContainer } from '@/components/SectionContainer';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageContainer } from '@/components/Page/PageContainer';
import { baseAnalytics } from '@/utils/analytics/base.lazy';
import { canUseDOM, isProd } from '@/utils/constants';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { ShouldAnimateNavigationProvider } from '@/contexts/shouldAnimateNavigation';

import '@/styles/theme.css';
import '@/styles/tailwind.css';

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
  const router = useRouter();
  const prefersReducedMotion = useReduceMotion();

  return (
    <>
      <ShouldAnimateNavigationProvider>
        <CommonMetaTags />
        <SectionContainer>
          <Header />
        </SectionContainer>
        <Flipper 
          flipKey={prefersReducedMotion ? 'static' : router.asPath} 
          staggerConfig={{
            default: {
              speed: 1,
            },
          }}>
          <SectionContainer>
            <PageContainer>
              <Component {...pageProps} />
            </PageContainer>
          </SectionContainer>
        </Flipper>
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
      </ShouldAnimateNavigationProvider>
    </>
  )
}

export default MyApp
