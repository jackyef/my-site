import tinytime from 'tinytime';
import { useRouter } from 'next/router';
import { MDXProvider } from '@mdx-js/react';
import { PageTitle } from '@/components/Typography/PageTitle';

import { PostMeta } from '@/blog/getAllPostPreviews';
import { InternalLink } from '@/components/Typography/InternalLink';
import { ExternalLink } from '@/components/Typography/ExternalLink';
import { PageMetaTags, publicUrl } from '@/components/Seo/PageMetaTags';

const mdxComponents = {
  pre: ({ className, ...props }: any) => (
    <pre
      className={`${className} rounded-md bg-gray-800 py-3 px-4 overflow-x-auto`}
      {...props}
    />
  ),
  'pre.code': ({ className, ...props }: any) => (
    <code className={`${className} text-gray-200`} {...props} />
  ),
};

const postDateTemplate = tinytime('{dddd}, {MMMM} {DD}, {YYYY}');

interface Props {
  meta: PostMeta;
  children: React.ReactChildren;
  posts: {
    title: string;
    link: string;
  }[];
}

export default function Post({ meta, children, posts }: Props) {
  const router = useRouter();
  const postIndex = posts.findIndex((post) => post.link === router.pathname);
  const previous = posts[postIndex + 1];
  const next = posts[postIndex - 1];

  return (
    <article className="xl:divide-y xl:divide-gray-200">
      <PageMetaTags
        title={`${meta.title} | jackyef.com`}
        description={meta.description}
        image={meta.image}
        url={`${publicUrl}${router.pathname}`}
      />
      <header className="pt-6 xl:pb-10">
        <div className="space-y-1 text-center">
          <dl className="space-y-10">
            <div>
              <dt className="sr-only">Published on</dt>
              <dd className="text-base leading-6 font-medium text-gray-500">
                <time dateTime={meta.date}>
                  {postDateTemplate.render(new Date(meta.date))}
                </time>
              </dd>
            </div>
          </dl>
          <div>
            <PageTitle>{meta.title}</PageTitle>
          </div>
        </div>
      </header>
      <div
        className="divide-y xl:divide-y-0 divide-gray-200 xl:grid xl:grid-cols-4 xl:col-gap-6 pb-16 xl:pb-20"
        style={{ gridTemplateRows: 'auto 1fr' }}
      >
        <dl className="pt-6 pb-10 xl:pt-11 xl:border-b xl:border-gray-200 xl:mr-4">
          <dt className="sr-only">Authors</dt>
          <dd>
            <ul className="flex justify-center xl:block space-x-8 sm:space-x-12 xl:space-x-0 xl:space-y-8">
              {meta.authors.map((author) => (
                <li
                  key={author.twitter}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={author.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <dl className="text-sm font-medium leading-5 whitespace-no-wrap">
                    <dt className="sr-only">Name</dt>
                    <dd className="text-gray-900">{author.name}</dd>
                    <dt className="sr-only">Twitter</dt>
                    <dd>
                      <ExternalLink
                        href={`https://twitter.com/${author.twitter}`}
                      >
                        {author.twitter}
                      </ExternalLink>
                    </dd>
                  </dl>
                </li>
              ))}
            </ul>
          </dd>
        </dl>
        <div className="divide-y divide-gray-200 xl:pb-0 xl:col-span-3 xl:row-span-2">
          <div className="prose max-w-none pt-10 pb-8">
            <MDXProvider components={mdxComponents}>{children}</MDXProvider>
          </div>
        </div>
        <footer className="text-sm font-medium leading-5 divide-y divide-gray-200 xl:col-start-1 xl:row-start-2">
          {(next || previous) && (
            <div className="space-y-8 py-8">
              {next && (
                <div>
                  <h2 className="text-xs tracking-wide uppercase text-gray-500">
                    Next Article
                  </h2>
                  <div>
                    <InternalLink href={next.link}>{next.title}</InternalLink>
                  </div>
                </div>
              )}
              {previous && (
                <div>
                  <h2 className="text-xs tracking-wide uppercase text-gray-500">
                    Previous Article
                  </h2>
                  <div>
                    <InternalLink href={previous.link}>
                      {previous.title}
                    </InternalLink>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="pt-8">
            <InternalLink href="/">&larr; Back to the blog</InternalLink>
          </div>
        </footer>
      </div>
    </article>
  );
}
