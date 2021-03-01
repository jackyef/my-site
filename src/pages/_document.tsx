import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <script
          dangerouslySetInnerHTML={{
            __html: [
              // set initial theme
              `var __storedPerf = localStorage.getItem('theme') || '';`,

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
         * But ultimately it loading time because we have no blocking resources
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
