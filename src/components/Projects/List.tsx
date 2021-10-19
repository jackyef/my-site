import React from 'react';
import { ProjectCard } from './ProjectCard';
import Carousel from '../Carousel';
import { projects } from './projects';

const ProjectsList = () => {
  return (
    <Carousel>
      {projects.map((p, i) => (
        <ProjectCard
          key={p.name}
          name={p.name}
          coverImage={p.coverImage}
          repo={p.repo}
          url={p.url}
          isFirst={i === 0}
        />
      ))}
    </Carousel>
  );
};

export default ProjectsList;
