import * as React from 'react';
import type { AppProps } from 'next/app'

import { SectionContainer } from '../components/SectionContainer';
import Header from '../components/Header';
import { MetaTags } from '../components/Seo/MetaTags';
import { Footer } from '../components/Footer';

import '../styles/tailwind.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <MetaTags />
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
