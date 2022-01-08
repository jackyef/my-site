import * as React from 'react';

export const SectionContainer: React.FC = ({ children }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 xl:px-0">{children}</div>
  );
};
