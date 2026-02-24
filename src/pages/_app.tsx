import * as React from 'react';
import { useRouter } from 'next/router';
import { Flipper } from 'react-flip-toolkit';
import { AppType } from 'next/dist/shared/lib/utils';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import dynamic from 'next/dynamic';

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
import { initFonts } from '@/utils/fonts';

// Dynamically imported so gamepad detection code is NOT in the main bundle
const GamepadToast = dynamic(
  () =>
    import('@/components/BigPicture/GamepadToast').then((m) => m.GamepadToast),
  { ssr: false },
);

const queryClient = new QueryClient();
initFonts();

const BIG_PICTURE_ROUTE = '/absurd-ui/big-picture';

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const prefersReducedMotion = useReduceMotion();

  // Full-screen pages bypass the standard site layout
  const isBigPicture = router.pathname === BIG_PICTURE_ROUTE;

  if (isBigPicture) {
    return (
      <>
        <Toaster />
        {/* @ts-expect-error */}
        <QueryClientProvider client={queryClient}>
          <NavigationProvider>
            <ThemeProvider>
              <CommonMetaTags />
              <Component {...pageProps} />
              {isProd ? <Analytics /> : null}
            </ThemeProvider>
          </NavigationProvider>
        </QueryClientProvider>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <CommandPaletteProvider>
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
              <GamepadToast />
              {isProd ? <Analytics /> : null}
            </ThemeProvider>
          </NavigationProvider>
        </QueryClientProvider>
      </CommandPaletteProvider>
    </>
  );
};

export default MyApp;
