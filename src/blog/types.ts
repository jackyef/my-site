import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface Author {
  name: string;
  twitter: string;
  avatar: string;
}

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  ogImage: {
    title: string;
    description?: string;
  };
  // authors: Author[];
  readingTime: string;
  tags: string[];
}

export type Post = {
  link: string;
  metadata: PostMeta;
  mdxSource: MDXRemoteSerializeResult;
};
