import React from 'react';
import { ThemeContext } from '../../../layouts';

const Tag = ({ children }) => {
  const theme = React.useContext(ThemeContext);

  return (
    <React.Fragment>
      <span>{children}</span>
      <style jsx>{`
        span {
          display: inline-block;
          border-radius: 4px;
          color: var(--textLink);
          background: transparent;
          border: 1px solid var(--textLink);
          padding: ${theme.space.xxs} ${theme.space.xs};
          margin-right: ${theme.space.xs};
          margin-bottom: ${theme.space.xs};
          font-size: ${theme.font.size.xxs};
        }
      `}</style>
    </React.Fragment>
  );
};

export default Tag;
