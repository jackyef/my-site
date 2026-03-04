import mediumStories from '@/components/Medium/medium-stories.json';

import type { Post, WritingItem } from './types';

export function postToWritingItem(post: Post): WritingItem {
  return {
    title: post.metadata.title,
    date: post.metadata.date,
    readingTime: post.metadata.readingTime,
    link: post.link,
    tags: post.metadata.tags,
    isExternal: false,
  };
}

export function getMediumWritings(): WritingItem[] {
  return mediumStories.map((story) => ({
    title: story.title,
    date: story.date,
    readingTime: story.timeToRead,
    link: story.url,
    tags: [],
    isExternal: true,
    publication: story.publication,
  }));
}

export function mergeWritings(posts: Post[]): WritingItem[] {
  const blogItems = posts.map(postToWritingItem);
  const mediumItems = getMediumWritings();

  return [...blogItems, ...mediumItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
