import React from 'react';
import { ThemeContext } from '../layouts';

import WhatIDo from '../components/WhatIDo';
import Seo from '../components/Seo';

const WhatIDoPage = () => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <React.Fragment>
          <div className="spacer" />
          <WhatIDo theme={theme} />
          <style jsx>{`
            .spacer {
              margin-bottom: 0;
            }

            @above desktop {
              .spacer {
                margin-bottom: ${`calc(${theme.space.xl} * 1.5)`};
              }
            }
          `}</style>
          <Seo />
        </React.Fragment>
      )}
    </ThemeContext.Consumer>
  );
};

export default WhatIDoPage;
