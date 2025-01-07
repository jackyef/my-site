import { css } from 'goober';
import { PropsWithChildren } from 'react';

import { getHslaColor } from '@/lib/styles/colors';

import { cn } from '@/utils/styles/classNames';

const borderColorClass = css`
  border-color: ${getHslaColor('text', 0.1)};
`;

export const Table = (props: PropsWithChildren<'table'>) => {
  return (
    <div
      className={cn(
        '-mx-4 mt-10 bg-surface-2 border sm:mx-0 rounded-lg not-prose',
        borderColorClass,
      )}
    >
      <table className="min-w-full">{props.children}</table>
    </div>
  );
};

Table.Tr = (props: PropsWithChildren<'tr'>) => {
  return <tr>{props.children}</tr>;
};

Table.Th = (props: PropsWithChildren<'th'>) => {
  return (
    <th
      scope="col"
      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-theme-text sm:pl-6"
    >
      {props.children}
    </th>
  );
};

Table.Td = (props: PropsWithChildren<'td'>) => {
  return (
    <td className={cn('relative py-4 pl-4 pr-3 text-sm sm:pl-6')}>
      {props.children}
    </td>
  );
};

Table.THead = (props: PropsWithChildren<'thead'>) => {
  return (
    <thead
      className={cn(
        'bg-surface-4 border-b',
        borderColorClass,
        css`
          & th:first-child {
            border-radius: 0.5rem 0 0 0;
          }

          & th:last-child {
            border-radius: 0 0.5rem 0 0;
          }
        `,
      )}
    >
      {props.children}
    </thead>
  );
};

Table.TBody = (props: PropsWithChildren<'tbody'>) => {
  return <tbody>{props.children}</tbody>;
};
