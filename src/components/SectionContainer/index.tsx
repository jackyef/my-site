import * as React from 'react';

interface Props {
  children?: React.ReactNode;
}

export const SectionContainer = ({ children }: Props) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 xl:px-0">{children}</div>
  );
};
