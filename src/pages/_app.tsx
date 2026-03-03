import type { AppProps } from 'next/app';
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
    </div>
  );
};

export default MyApp;
