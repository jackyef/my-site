import React from 'react';

import Carousel from '../Carousel';

import GitHubRepoCard from './RepoCard';
import RepoList from './repo-list.json';

const GitHubList = () => {
  return (
    <Carousel>
      {RepoList.map((repo, i) => (
        <GitHubRepoCard
          key={repo.title}
          title={repo.title}
          description={repo.description}
          url={repo.url}
          tags={repo.tags}
          isFirst={i === 0}
        />
      ))}
    </Carousel>
  );
};

export default GitHubList;
