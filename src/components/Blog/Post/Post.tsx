import tinytime from 'tinytime';
import { useRouter } from 'next/router';
import { MDXProvider } from '@mdx-js/react';
import { PageTitle } from '@/components/Typography/PageTitle';

import { PostMeta } from '@/blog/getAllPostPreviews';
import { InternalLink } from '@/components/Typography/InternalLink';
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

const postDateTemplate = tinytime('{MM} {DD}, {YYYY}');
const postDateTemplateXl = tinytime('{MMMM} {DD}, {YYYY}');

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
    <article className="animate-flyInTop">
      <PageMetaTags
        title={`${meta.title} | jackyef.com`}
        description={meta.description}
        image={meta.image}
        url={`${publicUrl}${router.pathname}`}
      />
      <header className="pt-6">
        <div>
          <div>
            <PageTitle>{meta.title}</PageTitle>
          </div>
          <dl className="mt-1">
            <div className="flex flex-row space-x-1 text-sm leading-6 font-md text-gray-600">
              <dt>Published on</dt>
              <dd>
                <time className="block md:hidden" dateTime={meta.date}>
                  {postDateTemplate.render(new Date(meta.date))}
                </time>
                <time className="hidden md:block" dateTime={meta.date}>
                  {postDateTemplateXl.render(new Date(meta.date))}
                </time>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <hr className="mx-6 xl:mx-8 bg-gray-600 my-6" />

      <div className="pb-16 xl:pb-20">
        <div className="xl:pb-0 xl:col-span-3 xl:row-span-2 animate-fadeIn">
          <div className="prose max-w-none pb-8">
            <MDXProvider components={mdxComponents}>{children}</MDXProvider>
          </div>
        </div>
        <footer className="text-sm font-medium leading-5 xl:col-start-1 xl:row-start-2">
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
        </footer>
      </div>
    </article>
  );
}
