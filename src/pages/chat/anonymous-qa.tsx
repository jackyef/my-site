import Head from 'next/head';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

const ChatPage = () => {
  return (
    <>
      <PageMetaTags
        title="Ask me anything, anonymously 💬"
        description="Ask me any question anonymously, no promise you'll get an answer though"
        image={createOgImageUrl({
          title: 'Ask me anything, anonymously 💬',
        })}
      />
      <Head>
        <meta httpEquiv="refresh" content="0; url=https://ngl.link/jackyef_" />
      </Head>

      <div className="text-center py-24">
        <h1 className="text-3xl md:text-6xl">Redirecting...</h1>
      </div>
    </>
  );
};

export default ChatPage;
