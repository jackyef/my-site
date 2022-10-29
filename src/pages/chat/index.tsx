import Head from 'next/head';

import { PageMetaTags } from '@/components/Seo/PageMetaTags';

import { createOgImageUrl } from '@/utils/createOgImageUrl';

const ChatPage = () => {
  return (
    <>
      <PageMetaTags
        title="30-min casual chat 💬"
        description="Schedule a casual chat about tech/career related stuff"
        image={createOgImageUrl({
          title: '30-min casual chat',
          description:
            'Schedule a chat to talk about tech, web, and career-related stuff!',
        })}
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
