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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
