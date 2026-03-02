import * as React from 'react';
import { AppType } from 'next/dist/shared/lib/utils';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Analytics } from '@/components/Analytics/Analytics';
import { CommonMetaTags } from '@/components/Seo/CommonMetaTags';
import { CommandPalette } from '@/components/CommandPalette';
import { CommandPaletteProvider } from '@/components/CommandPalette/CommandPaletteProvider';
import { AppShell } from '@/components/layout/AppShell';

import { isProd } from '@/utils/constants';
import { fontsClasses } from '@/utils/fonts';
import '@/styles/globals.css';

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    // Font variable classes here ensure Next.js injects the @font-face CSS.
    // The same classes are applied to <html> in _document.tsx so --font-fraunces
    // and --font-plus-jakarta-sans are defined at :root for use in CSS vars.
    <div className={fontsClasses}>
      <Toaster />
      <CommandPaletteProvider>
        {/* @ts-expect-error React 18 children prop */}
        <QueryClientProvider client={queryClient}>
          <CommonMetaTags />
          <AppShell>
            <Component {...pageProps} />
          </AppShell>
          <CommandPalette />
          {isProd ? <Analytics /> : null}
        </QueryClientProvider>
      </CommandPaletteProvider>
    </div>
  );
};

export default MyApp;
