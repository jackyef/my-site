import React from 'react';

const Tag: React.FC = ({ children }) => {
  return (
    <span className="inline-block rounded-lg text-blue-500 border-blue-500 border-solid border py-0.5 px-2 mr-2 mb-2 text-sm">
      {children}
    </span>
  );
};

export default Tag;
