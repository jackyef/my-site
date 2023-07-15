import React, { useId, useMemo } from 'react';
import clsx from 'clsx';
import { css } from 'goober';

import type { PostHeading } from '@/blog/types';
import { cleanHeadingContent, slugify } from '@/lib/blog';
import { getHslaColor } from '@/lib/styles/colors';

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
        <li
          key={slug}
          className={clsx('pb-2 transition-colors', {
            'pl-2 border-l-4': heading.level === 3,
            [css`
              border-color: ${getHslaColor('primary', 0.1)};

              &:has(a.active),
              &:hover,
              &:focus-within {
                border-color: ${getHslaColor('primary', 0.4)};
              }
            `]: heading.level === 3,
          })}
        >
          <a
            data-tocItem // Used by withTocHighlighter
            href={`#${slug}`}
            className={clsx(
              'text-sm text-theme-subtitle',
              'transition-colors',
              css`
                &.active,
                &:hover,
                &:focus {
                  color: ${getHslaColor('primary')};
                }
              `,
            )}
          >
            {cleanHeadingContent(heading.content)}
          </a>
        </li>
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
        <ol key={listKey++} className={clsx('mb-4')}>
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
      <div className={clsx('font-bold text-lg mb-4')} id={labelId}>
        In this post
      </div>

      {content}
    </nav>
  );
};
