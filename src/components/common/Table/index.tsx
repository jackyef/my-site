import { PropsWithChildren } from 'react';

import { cn } from '@/utils/styles/classNames';

export const Table = (props: PropsWithChildren<'table'>) => {
  return (
    <div className="mt-10 bg-(--color-bg-panel) border border-(--color-border) rounded-lg not-prose overflow-x-auto">
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
      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-(--color-ink) sm:pl-6 first:rounded-tl-lg last:rounded-tr-lg"
    >
      {props.children}
    </th>
  );
};

Table.Td = (props: PropsWithChildren<'td'>) => {
  return (
    <td
      className={cn(
        'relative py-4 pl-4 pr-3 text-sm text-(--color-ink-2) sm:pl-6',
      )}
    >
      {props.children}
    </td>
  );
};

Table.THead = (props: PropsWithChildren<'thead'>) => {
  return (
    <thead className="bg-(--color-bg-hover) border-b border-(--color-border)">
      {props.children}
    </thead>
  );
};

Table.TBody = (props: PropsWithChildren<'tbody'>) => {
  return <tbody>{props.children}</tbody>;
};
