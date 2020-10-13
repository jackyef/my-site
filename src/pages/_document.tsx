import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script dangerouslySetInnerHTML={{ __html: `document.body.setAttribute('data-theme', localStorage.getItem('theme))`}} />
        </Head>
        <body data-theme="default">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}