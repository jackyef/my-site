import { useWebmention } from './hooks/useWebmention';

interface Props {
  url: string;
}

const WebmentionWidget = ({ url }: Props) => {
  const { isLoading, isError, data, refetch } = useWebmention(url);

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
      return <div className="opacity-0 h-12">a</div>;
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
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex space-x-3 items-center">
            <div>❤️ {likes.length}</div>
            <div>🔄 {reposts.length}</div>
            <div>💬 {discussions.length}</div>
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
      );
    }
  })();

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Webmentions</h3>
      <div className={isLoading ? 'animate-pulse bg-gray-300 rounded-lg' : ''}>
        {content}
      </div>
    </div>
  );
};

export default WebmentionWidget;
