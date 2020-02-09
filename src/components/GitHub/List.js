import React from 'react';
import GitHubRepoCard from './RepoCard';
import Carousel from '../Carousel';

import RepoList from './repo-list.json';

const GitHubList = () => {
  return (
    <Carousel>
      {RepoList.map(repo => (
        <GitHubRepoCard
          key={repo.title}
          title={repo.title}
          description={repo.description}
          url={repo.url}
          tags={repo.tags}
        />
      ))}
    </Carousel>
  );
};

export default GitHubList;
