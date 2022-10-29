import * as React from 'react';
import { useRouter } from 'next/router';
import { Flipper } from 'react-flip-toolkit';
import { AppType } from 'next/dist/shared/lib/utils';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import clsx from 'clsx';

import { Analytics } from '@/components/Analytics/Analytics';
import { CommonMetaTags } from '@/components/Seo/CommonMetaTags';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageContainer } from '@/components/Page/PageContainer';
import { CommandPalette } from '@/components/CommandPalette';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import { CommandPaletteProvider } from '@/components/CommandPalette/CommandPaletteProvider';
import { NavigationProvider } from '@/contexts/navigation';

import { useReduceMotion } from '@/hooks/useReduceMotion';

import { isProd } from '@/utils/constants';
import '@/styles/theme.css';
import '@/styles/tailwind.css';
import { interFont } from '@/utils/fonts';

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const prefersReducedMotion = useReduceMotion();

  return (
    <div className={clsx(interFont.className)}>
      <Toaster />
      <CommandPaletteProvider>
        {/* Suppress children prop error because of React 18 */}
        {/* @ts-expect-error */}
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
              {isProd ? <Analytics /> : null}
            </ThemeProvider>
          </NavigationProvider>
        </QueryClientProvider>
      </CommandPaletteProvider>
    </div>
  );
};

export default MyApp;
