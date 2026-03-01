import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentProps,
} from 'next/document';
import { extractCss } from 'goober';
import { getSandpackCssText } from '@codesandbox/sandpack-react';

import { fontsClasses } from '@/utils/fonts';

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
      <Html lang="en" className={fontsClasses}>
        <Head>
          <style
            dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
            id="sandpack"
            key="sandpack-css"
          />
          <style
            id={'_goober'}
            dangerouslySetInnerHTML={{ __html: ' ' + this.props.css }}
          />
        </Head>
        <script
          dangerouslySetInnerHTML={{
            __html: [
              `try {`,
              `var __stored = localStorage.getItem('theme') || '';`,
              `var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');`,
              `if (!__stored && darkQuery.matches) { __stored = 'dark'; }`,
              `document.documentElement.setAttribute('data-theme', __stored || 'light');`,
              `darkQuery.addEventListener('change', function(e) {`,
              `  var __pref = localStorage.getItem('theme');`,
              `  if (!__pref) {`,
              `    var t = e.matches ? 'dark' : 'light';`,
              `    document.documentElement.setAttribute('data-theme', t);`,
              `    typeof window.__themeBinding === 'function' && window.__themeBinding(t);`,
              `  }`,
              `});`,
              `} catch (err) {}`,
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
