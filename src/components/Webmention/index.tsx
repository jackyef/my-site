import { useState } from 'react';
import { PostMeta } from '@/blog/getAllPostPreviews';
import { TwitterShare } from '../Social/TwitterShare';
import { useWebmention } from './hooks/useWebmention';
import { ExternalLink } from '../Typography/ExternalLink';
import tinytime from 'tinytime';

interface Props {
  url: string;
  meta: PostMeta;
}

const repliesTimeTemplate = tinytime('{DD} {MM} {YYYY} - {h}:{mm} {a}');

const WebmentionWidget = ({ url, meta }: Props) => {
  const { isLoading, isError, data, refetch } = useWebmention(url);
  const [showReplies, setShowReplies] = useState(false);

  const content = (() => {
    if (isError) {
      return (
        <div className="bg-red-200 text-red-700 rounded-lg p-4 m-4">
          Something bad happened when trying to load Webmentions 😐 <br />
          <a
            className="hover:underline cursor-pointer font-bold"
            onClick={() => refetch()}
          >
            Try again?
          </a>
        </div>
      );
    }

    if (isLoading) {
      return <div className="opacity-0 h-12">.</div>;
    }

    if (data) {
      const { likes, reposts, discussions, authors } = data;

      const maxAuthorsShown = 4;
      const _authors =
        authors.length > maxAuthorsShown
          ? authors.slice(0, maxAuthorsShown)
          : authors;
      const authorImages = _authors.map((a) => (
        <img
          loading="lazy"
          key={a.url}
          src={a.photo}
          alt={a.name}
          className="rounded-full w-8 h-8 border-2 border-gray-50"
        />
      ));
      const otherAuthorsCount = authors.length - _authors.length;

      return (
        <>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex space-x-3 items-center">
              <div className="flex space-x-1">
                <span>❤️</span> <span>{likes.length}</span>
              </div>
              <div className="flex space-x-1">
                <span>🔄</span> <span>{reposts.length}</span>
              </div>
              <div className="flex space-x-1">
                <span>💬</span> <span>{discussions.length}</span>
                <button
                  onClick={() => setShowReplies((prev) => !prev)}
                  className="hover:underline"
                >
                  (show all)
                </button>
              </div>
            </div>
            <div className="pl-0 md:pl-6">
              <div className="flex -space-x-2">
                {authorImages}
                {otherAuthorsCount > 0 ? (
                  <div className="flex items-center justify-center text-sm pl-4">
                    and {otherAuthorsCount} others.
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <TwitterShare
            text={`${meta.title} ${url} via @jackyef__`}
          >
            Discuss on Twitter
          </TwitterShare>

          {showReplies ? (
            <div className="flex flex-col mt-4 space-y-4">
              {discussions.map((discussion: any) => {
                const author = discussion.author || {};

                return (
                  <div
                    key={discussion['wm-id']}
                    className="p-4 md:p-6 rounded-lg shadow-md"
                  >
                    <div className="flex flex-col space-y-2">
                      <div>
                        <img
                          className="inline rounded-full w-8 h-8 mr-2"
                          loading="lazy"
                          width={48}
                          height={48}
                          src={author.photo}
                          alt={author.name}
                        />
                        <ExternalLink href={author.url}>
                          <span className="font-bold">{author.name}</span>
                        </ExternalLink>
                        <span className="ml-1 text-sm text-theme-subtitle">
                          &middot;{' '}
                          {repliesTimeTemplate.render(
                            new Date(discussion.published),
                          )}
                        </span>
                      </div>
                      <p className="text-theme-text">{discussion.content.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      );
    }
  })();

  return (
    <>
      <div className="mb-2">
        <h3 className="text-lg font-bold mb-2">Webmentions</h3>
        <div
          className={isLoading ? 'animate-pulse bg-gray-300 rounded-lg' : ''}
        >
          {content}
        </div>
      </div>
    </>
  );
};

export default WebmentionWidget;
