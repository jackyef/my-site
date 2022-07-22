import React from 'react';

import Carousel from '../Carousel';

import MediumPostCard from './PostCard';
import stories from './medium-stories.json';

const MediumList = () => {
  return (
    <Carousel>
      {stories.map((s, i) => (
        <MediumPostCard
          key={s.title}
          title={s.title}
          coverImage={s.coverImage}
          url={s.url}
          timeToRead={s.timeToRead}
          isFirst={i === 0}
        />
      ))}
    </Carousel>
  );
};

export default MediumList;
