import Head from 'next/head';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';

const ChatPage = () => {
  return (
    <>
      <PageMetaTags
        title="30-min casual chat 💬"
        description="Schedule a casual chat about tech/career related stuff"
        image="https://jackyef-og-img.vercel.app/**30-min%20casual%20chat**%20%F0%9F%92%AC.png?fontSize=150px"
      />
      <Head>
        <meta
          httpEquiv="refresh"
          content="0; url=https://cal.com/jackyef/casual-chat"
        />
      </Head>

      <div className="text-center py-24">
        <h1 className="text-3xl md:text-6xl">Redirecting...</h1>
      </div>
    </>
  );
};

export default ChatPage;
