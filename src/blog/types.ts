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

export type PostHeading = {
  level: number; // We only want to create TOC item for h2 and h3
  content: string;
};

export type Post = {
  link: string;
  metadata: PostMeta;
  headings: PostHeading[];
  mdxSource: MDXRemoteSerializeResult;
};
