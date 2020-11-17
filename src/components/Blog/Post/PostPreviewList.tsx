import tinytime from 'tinytime';
import getAllPostPreviews from '@/blog/getAllPostPreviews';
import { InternalLink } from '@/components/Typography/InternalLink';
import { sendEventTracker } from '@/utils/analytics/tracker';
import { useRouter } from 'next/router';

const posts = getAllPostPreviews();

const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}');

export const PostPreviewList = () => {
  const router = useRouter();

  return (
    <ul className="divide-y divide-gray-200">
      {posts.map(({ link, module: { default: Component, meta } }) => {
        return (
          <li key={link} className="py-4">
            <article className="space-y-2">
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl leading-8 font-bold tracking-tight">
                      <InternalLink
                        href={link}
                        className="fancy-anchor text-theme-text font-bold"
                        onClick={() => {
                          sendEventTracker({
                            name: 'click',
                            category: `${router.pathname} - post preview title`,
                            label: meta.title,
                          });
                        }}
                      >
                        {meta.title}
                      </InternalLink>
                    </h2>
                    <div className="flex">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-xs leading-6 font text-theme-subtitle">
                          <time dateTime={meta.date}>
                            {postDateTemplate.render(new Date(meta.date))}
                          </time>
                        </dd>
                      </dl>
                      <div className="mx-1">&middot;</div>
                      <dl>
                        <dt className="sr-only">Time to read</dt>
                        <dd className="text-xs leading-6 font text-theme-subtitle">
                          {meta.readingTime} ☕
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="prose max-w-none text-theme-text">
                    <Component />
                  </div>
                </div>
                <div className="text-base leading-6 font-medium">
                  <InternalLink
                    href={link}
                    aria-label={`Read "${meta.title}"`}
                    onClick={() => {
                      sendEventTracker({
                        name: 'click',
                        category: `${router.pathname} - post preview read more`,
                        label: meta.title,
                      });
                    }}
                  >
                    Read more &rarr;
                  </InternalLink>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
};
