import React, { useId } from 'react';
import clsx from 'clsx';
import { css } from 'goober';

import type { PostHeading } from '@/blog/types';
import { cleanHeadingContent, sluggify } from '@/lib/blog';
import { getHslaColor } from '@/lib/styles/colors';

type Props = {
  headings: PostHeading[];
};

export const TableOfContents = ({ headings }: Props) => {
  const labelId = useId();

  const constructTableOfContents = () => {
    let lastHeadingLevel: number;
    const rootList: Array<React.ReactNode | React.ReactNode[]> = [];
    let currentList: Array<React.ReactNode | React.ReactNode> = rootList;

    headings.forEach((heading) => {
      const slug = sluggify(heading.content);
      const listItem = (
        <li
          key={slug}
          className={clsx('pb-2 transition-colors', {
            'pl-2 border-l-4': heading.level === 3,
            [css`
              border-color: ${getHslaColor('text', 0.1)};

              &:hover,
              &:focus-within {
                border-color: ${getHslaColor('text', 0.4)};
              }
            `]: heading.level === 3,
          })}
        >
          <a
            href={`#${slug}`}
            className={clsx(
              'text-sm text-theme-subtitle',
              'hover:text-theme-heading focus:text-theme-heading',
              'transition-colors',
              css`
                &:focus {
                  box-shadow: none !important;
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
  };

  return (
    <nav aria-labelledby={labelId}>
      <div className={clsx('font-bold text-lg mb-4')} id={labelId}>
        In this post
      </div>

      {constructTableOfContents()}
    </nav>
  );
};
