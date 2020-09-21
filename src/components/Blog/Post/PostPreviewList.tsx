import tinytime from 'tinytime';
import getAllPostPreviews from '@/blog/getAllPostPreviews';
import { InternalLink } from '@/components/Typography/InternalLink';

const posts = getAllPostPreviews();

const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}');

export const PostPreviewList = () => (
  <ul className="divide-y divide-gray-200">
    {posts.map(({ link, module: { default: Component, meta } }) => {
      return (
        <li key={link} className="py-12">
          <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
            <dl>
              <dt className="sr-only">Published on</dt>
              <dd className="text-base leading-6 font-medium text-gray-500">
                <time dateTime={meta.date}>
                  {postDateTemplate.render(new Date(meta.date))}
                </time>
              </dd>
            </dl>
            <div className="space-y-5 xl:col-span-3">
              <div className="space-y-6">
                <h2 className="text-2xl leading-8 font-bold tracking-tight">
                  <InternalLink href={link}>
                    <a className="text-gray-900">{meta.title}</a>
                  </InternalLink>
                </h2>
                <div className="prose max-w-none text-gray-500">
                  <Component />
                </div>
              </div>
              <div className="text-base leading-6 font-medium">
                <InternalLink href={link} aria-label={`Read "${meta.title}"`}>
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
