import * as React from 'react';
import type { AppProps } from 'next/app'
import { CommonMetaTags } from '@/components/Seo/CommonMetaTags';

import { SectionContainer } from '../components/SectionContainer';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

import '../styles/tailwind.css';

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
    </>
  )
}

export default MyApp
