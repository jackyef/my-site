import PropTypes from 'prop-types';
import React from 'react';
import { ThemeContext } from '../layouts';

import WhatIDo from '../components/WhatIDo';

const WhatIDoPage = () => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <React.Fragment>
          <div className="spacer" />
          <WhatIDo theme={theme} />
          <style jsx>{`
            .spacer {
              margin-bottom: ${`calc(${theme.space.xl} * 1.5)`};
            }
          `}</style>
        </React.Fragment>
      )}
    </ThemeContext.Consumer>
  );
};

export default WhatIDoPage;
