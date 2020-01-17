import React from 'react';
import GitHubRepoCard from './RepoCard';
import Carousel from '../Carousel';

const GitHubList = () => {
  return (
    <Carousel>
      <GitHubRepoCard
        title="react-isomorphic-data"
        description="Easily fetch json data in your React components, with similar APIs to react-apollo 🎉"
        url="https://github.com/jackyef/react-isomorphic-data"
      />
      <GitHubRepoCard
        title="bundle-calc"
        description="calculate bundle size of your next project!"
        url="https://github.com/jackyef/bundle-calc"
      />
      <GitHubRepoCard
        title="bundlewatch-gh-action"
        description="GitHub action that allows you to easily run bundlewatch in your repository 📦"
        url="https://github.com/jackyef/bundlewatch-gh-action"
      />
      <GitHubRepoCard
        title="rqrr-wasm"
        description="The rust QR decoder library `rqrr`; compiled to WebAssembly."
        url="https://github.com/jackyef/rqrr-wasm"
      />
      <GitHubRepoCard
        title="source-map-explorer-remote"
        description="Wrapper around source-map-explorer that works with remote URLs and chrome code coverage"
        url="https://github.com/jackyef/source-map-explorer-remote"
      />
    </Carousel>
  );
};

export default GitHubList;
