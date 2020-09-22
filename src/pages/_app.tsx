import * as React from 'react';
import type { AppProps } from 'next/app'
import Head from 'next/head';

import { CommonMetaTags } from '@/components/Seo/CommonMetaTags';

import { SectionContainer } from '../components/SectionContainer';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

import '../styles/tailwind.css';
import { useRouter } from 'next/router';
import { sendPageView } from '@/utils/tracker';

const googleAnalyticsId = 'UA-149852843-3';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  React.useEffect(() => {
    // send pageview events to gtag on routechange
    const handleRouteChange = (url: any) => {
      sendPageView({ url });
    }
    
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    }
  }, [router])

  return (
    <>
      <Head>
        {/* Global site tag (gtag.js) - Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />

        {/* The following script automatically track pageview as well */}
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${googleAnalyticsId}');`}} />
      </Head>
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
    </>
  )
}

export default MyApp
