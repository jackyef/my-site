import type { AppProps } from 'next/app';
import { MotionConfig } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Analytics } from '@/components/Analytics/Analytics';
import { CommonMetaTags } from '@/components/Seo/CommonMetaTags';
import { CommandPalette } from '@/components/CommandPalette';
import { CommandPaletteProvider } from '@/components/CommandPalette/CommandPaletteProvider';
import { AppShell } from '@/components/layout/AppShell';

import { isProd } from '@/utils/constants';
import { fontsClasses } from '@/utils/fonts';
import '@/styles/globals.css';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    // Font variable classes here ensure Next.js injects the @font-face CSS.
    <div className={fontsClasses}>
      {/*
        globals.css collapses CSS animations and transitions under
        prefers-reduced-motion, but `motion` drives transforms from
        requestAnimationFrame straight onto inline styles — no transition
        property for that rule to touch. A dozen components animate this way,
        and every one of them ignored the setting until this wrapper.
        `reducedMotion="user"` keeps opacity and colour crossfades while
        dropping the movement, which is the trade the guidance asks for.
      */}
      <MotionConfig reducedMotion="user">
        <Toaster />
        <CommandPaletteProvider>
          <QueryClientProvider client={queryClient}>
            <CommonMetaTags />
            <AppShell>
              <Component {...pageProps} />
            </AppShell>
            <CommandPalette />
            {isProd ? <Analytics /> : null}
          </QueryClientProvider>
        </CommandPaletteProvider>
      </MotionConfig>
    </div>
  );
};

export default MyApp;
