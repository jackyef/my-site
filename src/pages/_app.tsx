import * as React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Flipper } from 'react-flip-toolkit';

import { CommonMetaTags } from '@/components/Seo/CommonMetaTags';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageContainer } from '@/components/Page/PageContainer';
import { isProd } from '@/utils/constants';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { NavigationProvider } from '@/contexts/navigation';

import '@/styles/theme.css';
import '@/styles/tailwind.css';
import { CommandPalette } from '@/components/CommandPalette';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import { AppType } from 'next/dist/shared/lib/utils';

import { QueryClient, QueryClientProvider } from 'react-query';
import { CommandPaletteProvider } from '@/components/CommandPalette/CommandPaletteProvider';
import Script from 'next/script';
import { Toaster } from '@/components/Toaster';

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const prefersReducedMotion = useReduceMotion();

  return (
    <>
      <Toaster />
      <CommandPaletteProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationProvider>
            <ThemeProvider>
              <CommonMetaTags />

              <Header />

              <Flipper
                flipKey={prefersReducedMotion ? 'static' : router.asPath}
                staggerConfig={{
                  default: {
                    speed: 1,
                  },
                }}
              >
                <PageContainer>
                  <Component {...pageProps} />
                </PageContainer>
              </Flipper>

              <Footer />

              <CommandPalette />
              {isProd ? (
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
                </>
              ) : null}
            </ThemeProvider>
          </NavigationProvider>
        </QueryClientProvider>
      </CommandPaletteProvider>
    </>
  );
};

export default MyApp;
