import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/utils/styles/classNames';

/**
 * Every part takes the props of the element it renders, so callers can pass
 * className, colSpan, scope and the rest through.
 *
 * These were previously typed `PropsWithChildren<'table'>`, which resolves to
 * `'table' & { children }` — a string intersection, not a props object. Nothing
 * caught it because the only consumer was the MDX registry, where the mapping
 * is untyped.
 */
export const Table = ({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<'table'>) => {
  return (
    <div className="mt-10 bg-(--color-bg-panel) border border-(--color-border) rounded-lg not-prose overflow-x-auto scroll-slim">
      <table className={cn('min-w-full', className)} {...rest}>
        {children}
      </table>
    </div>
  );
};

Table.Tr = ({ children, ...rest }: ComponentPropsWithoutRef<'tr'>) => {
  return <tr {...rest}>{children}</tr>;
};

Table.Th = ({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<'th'>) => {
  return (
    <th
      scope="col"
      className={cn(
        'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-(--color-ink) sm:pl-6 first:rounded-tl-lg last:rounded-tr-lg',
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
};

Table.Td = ({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<'td'>) => {
  return (
    <td
      className={cn(
        'relative py-4 pl-4 pr-3 text-sm text-(--color-ink-2) sm:pl-6',
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  );
};

Table.THead = ({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<'thead'>) => {
  return (
    <thead
      className={cn(
        'bg-(--color-bg-hover) border-b border-(--color-border)',
        className,
      )}
      {...rest}
    >
      {children}
    </thead>
  );
};

Table.TBody = ({ children, ...rest }: ComponentPropsWithoutRef<'tbody'>) => {
  return <tbody {...rest}>{children}</tbody>;
};
