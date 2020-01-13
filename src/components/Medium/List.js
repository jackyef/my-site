import React from 'react';
import MediumPostCard from './PostCard';
import { ThemeContext } from '../../layouts';
import stories from './medium-stories.json';

const MediumList = () => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <React.Fragment>
          <section>
            {stories.map(s => (
              <MediumPostCard
                key={s.title}
                title={s.title}
                coverImage={s.coverImage}
                excerpt={s.excerpt}
                url={s.url}
                timeToRead={s.timeToRead}
              />
            ))}
          </section>

          <style jsx>{`
            section {
              display: block;
              padding: 0 ${theme.space.s};
              white-space: nowrap;
              overflow-x: scroll;
              scroll-snap-type: x mandatory;
              vertical-align: top;
            }
          `}</style>
        </React.Fragment>
      )}
    </ThemeContext.Consumer>
  );
};

export default MediumList;
