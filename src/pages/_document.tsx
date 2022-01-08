import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentProps,
} from 'next/document';
import { extractCss } from 'goober';

interface Props extends DocumentProps {
  css: string;
}
export default class MyDocument extends Document<Props> {
  static async getInitialProps({ renderPage }: DocumentContext) {
    const page = await renderPage();
    const css = extractCss();

    return { ...page, css };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <style
            id={'_goober'}
            // And defined it in here
            dangerouslySetInnerHTML={{ __html: ' ' + this.props.css }}
          />
        </Head>
        <script
          dangerouslySetInnerHTML={{
            __html: [
              // set initial theme
              `var __storedPerf = localStorage.getItem('theme') || '';`,

              `if (!__storedPerf && window.matchMedia('(prefers-color-scheme: dark)').matches) {`,
              `__storedPerf = 'dark';`,
              `}`,

              `if (__storedPerf) {`,
              `document.documentElement.setAttribute('data-theme', __storedPerf);`,
              `}`,

              // setup listener to make it reactive
              `var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');`,
              `darkQuery.addListener(function(e) {`,
              `var __newTheme = e.matches ? 'dark' : 'default';`,
              `document.documentElement.setAttribute('data-theme', __newTheme);`,
              `typeof window.__themeBinding === 'function' && window.__themeBinding(__newTheme);`,
              `});`,
            ].join(''),
          }}
        />
        {/* Preload the css file containing our font-faces */}
        <link rel="preload" as="style" href="/fonts.css" />

        {/*
         * We load the fonts.css asynchronously
         * Doing it this way cause some FOUT and layout shifts
         * But ultimately it improves loading time because we have no blocking resources
         * Read: https://csswizardry.com/2020/05/the-fastest-google-fonts/
         */}
        <link
          rel="stylesheet"
          href="/fonts.css"
          media="print"
          // @ts-expect-error
          onLoad="this.media='all'"
        />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
