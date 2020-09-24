import tinytime from 'tinytime';
import { PageTitle } from '@/components/Typography/PageTitle';
import { PostMeta } from '@/blog/getAllPostPreviews';

const postDateTemplate = tinytime('{MM} {DD}, {YYYY}');
const postDateTemplateXl = tinytime('{MMMM} {DD}, {YYYY}');

interface Props {
  meta: PostMeta;
}

export const PostHeader = ({ meta }: Props) => (
  <>
    <header>
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
            <div className="mx-1">&middot;</div>
            <dt className="sr-only">Time to read</dt>
            <dd className="leading-6 font text-gray-500">
              {meta.readingTime} ☕
            </dd>
          </div>
        </dl>
      </div>
    </header>

    <hr className="mx-6 xl:mx-8 bg-gray-600 my-6" />
  </>
);
