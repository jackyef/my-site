import { FunctionComponent, HTMLProps } from 'react';

export const Pre: FunctionComponent<HTMLProps<HTMLPreElement>> = ({
  className,
  ...props
}) => (
  <pre
    className={`${className} rounded-lg bg-(--code-bg) border border-(--color-border) py-3 px-4 overflow-x-auto`}
    {...props}
  />
);

export const PreCode: FunctionComponent<HTMLProps<HTMLSpanElement>> = ({
  className,
  ...props
}) => <code className={`${className} text-(--code-text)`} {...props} />;
