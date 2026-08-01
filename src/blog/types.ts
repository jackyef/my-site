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
  // The id rehype-slug put on the heading element, not a slug derived a second
  // time from the title — the anchor has to be the same string the document
  // uses, and deriving it twice is what broke it before.
  id: string;
  text: string;
};

export type Post = {
  link: string;
  metadata: PostMeta;
  headings: PostHeading[];
  mdxSource: MDXRemoteSerializeResult;
};

export type WritingItem = {
  title: string;
  date: string;
  readingTime: string;
  link: string;
  tags: string[];
  isExternal: boolean;
  isLatest?: boolean;
  publication?: string;
};
