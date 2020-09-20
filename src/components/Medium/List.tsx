import React from 'react';
import MediumPostCard from './PostCard';
import Carousel from '../Carousel';
import stories from './medium-stories.json';

const MediumList = () => {
  return (
    <Carousel>
      {stories.map(s => (
        <MediumPostCard
          key={s.title}
          title={s.title}
          coverImage={s.coverImage}
          url={s.url}
          timeToRead={s.timeToRead}
        />
      ))}
    </Carousel>
  );
};

export default MediumList;
