import * as React from 'react';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { useRouter } from 'next/router';

import { CommonMetaTags } from '@/components/Seo/CommonMetaTags';
import { SectionContainer } from '@/components/SectionContainer';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';

import { sendPageView } from '@/utils/tracker';

import '@/styles/tailwind.css';

let noAnimClassRemoved = false;

(() => {
  // Load custom tracking code lazily, so it's non-blocking.
  // https://github.com/philipwalton/analyticsjs-boilerplate/blob/master/src/index.js
  import('../utils/analytics/base.js').then((analytics) => analytics.init());
})();

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  React.useEffect(() => {
    // send pageview events to gtag on routechange
    const handleRouteChange = (url: any) => {
      sendPageView({ url });
    }
    
    const removeNoAnimClass = () => {
      if (!noAnimClassRemoved) {
        document.body.classList.remove('no-animation');
        noAnimClassRemoved = true;
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('beforeHistoryChange', removeNoAnimClass);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('beforeHistoryChange', removeNoAnimClass);
    }
  }, [router])

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
        {process.env.NODE_ENV === 'production'
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
