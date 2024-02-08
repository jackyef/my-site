import React, { useId, useMemo } from 'react';

import type { PostHeading } from '@/blog/types';
import { cleanHeadingContent, slugify } from '@/lib/blog';

import { cn } from '@/utils/styles/classNames';

import { TableOfContentItem } from './TableOfContentItem';

type Props = {
  headings: PostHeading[];
};

export const TableOfContents = ({ headings }: Props) => {
  const labelId = useId();

  const content = useMemo(() => {
    let lastHeadingLevel: number;
    const rootList: Array<React.ReactNode | React.ReactNode[]> = [];
    let currentList: Array<React.ReactNode | React.ReactNode> = rootList;

    headings.forEach((heading) => {
      const slug = slugify(heading.content);
      const listItem = (
        <TableOfContentItem
          key={slug}
          slug={slug}
          content={cleanHeadingContent(heading.content)}
          level={heading.level}
        />
      );

      // This snippet only works because we only handle h2 and h3
      if (!lastHeadingLevel || heading.level === lastHeadingLevel) {
        currentList.push(listItem);
      } else if (heading.level > lastHeadingLevel) {
        const newList = [listItem];
        currentList.push(newList);
        currentList = newList;
      } else {
        rootList.push(listItem);
        currentList = rootList;
      }
      lastHeadingLevel = heading.level;
    });

    let listKey = 1;

    const renderList = (array: Array<React.ReactNode>) => {
      return (
        <ol key={listKey++} className={cn('mb-4')}>
          {array.map((listItem) => listItem)}
        </ol>
      );
    };

    return renderList(
      rootList.map((listOrItem) => {
        if (Array.isArray(listOrItem)) {
          return renderList(listOrItem);
        } else {
          return listOrItem;
        }
      }),
    );
  }, [headings]);

  return (
    <nav aria-labelledby={labelId}>
      <div
        className={cn(
          'font-bold text-theme-heading opacity-70 mb-4 uppercase tracking-wider',
        )}
        id={labelId}
      >
        In this post
      </div>

      {content}
    </nav>
  );
};
