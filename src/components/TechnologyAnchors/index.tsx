import { Fragment } from 'react';

import { TECHNOLOGIES } from '@/constants/technologies';

import { ExternalLink } from '../Typography/ExternalLink';

export const TechnologyAnchors = () => {
  return (
    <>
      {TECHNOLOGIES.map(({ name, href }, index) => {
        const isLastItem = index === TECHNOLOGIES.length - 1;
        const prefix = isLastItem ? 'and ' : '';
        const suffix = isLastItem ? '' : ', ';

        return (
          <Fragment key={name}>
            {prefix}
            <ExternalLink key={name} href={href} shouldShowPreviewOnHover>
              {name}
            </ExternalLink>
            {suffix}
          </Fragment>
        );
      })}
    </>
  );
};
