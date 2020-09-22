import * as React from 'react';
import type { AppProps } from 'next/app'
import { CommonMetaTags } from '@/components/Seo/CommonMetaTags';

import { SectionContainer } from '../components/SectionContainer';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

import '../styles/tailwind.css';

if (typeof window !== 'undefined') {
  // some hack to only enable animation for page navigation
  // but not initial page load
  const enableAnim = () => {
    console.log('no-anim removed')
    document.body.classList.remove('no-animation');

    window.removeEventListener('click', enableAnim);
  };

  window.addEventListener('click', enableAnim);
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
    </>
  )
}

export default MyApp
