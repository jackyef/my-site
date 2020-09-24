import * as React from 'react';
import Head from 'next/head';

export const publicUrl = 'https://jackyef.com';
const defaultTitle = 'jackyef.com';
const defaultDescription =
  'Personal site of Jacky Efendi. I work with JavaScript and all things web. 🌐';
const defaultOgImage =
  'https://jackyef-og-img.vercel.app/Hi%2C%20I%20am%20**Jacky**!%20%20%F0%9F%91%8B.png?fontSize=150px';

interface Props {
  image?: string;
  title?: string;
  description?: string;
  url?: string;
  publishDate?: string;
  readingTime?: string;
}

export const PageMetaTags: React.FC<Props> = ({
  image = defaultOgImage,
  title = defaultTitle,
  description = defaultDescription,
  url = publicUrl,
  publishDate = '',
  readingTime = '',
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Facebook OG meta tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Meta Tags  */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={url} />
      <meta property="twitter:creator" content="@jackyef__" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:url" content={url} />

      {publishDate ? (
        <>
          <meta name="twitter:label1" content="Published on" />
          <meta name="twitter:data1" content={publishDate} />
        </>
      ) : null}

      {readingTime ? (
        <>
          <meta name="twitter:label2" content="Reading Time" />
          <meta name="twitter:data2" content={readingTime} />
        </>
      ) : null}
    </Head>
  );
};
