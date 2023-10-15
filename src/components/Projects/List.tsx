import React from 'react';

import Carousel from '../Carousel';

import { ProjectCard } from './ProjectCard';
import { projects } from './projects';

const ProjectsList = () => {
  return (
    <Carousel scrollTimelineName="projectCarousel">
      {projects.map((p, i) => (
        <ProjectCard
          key={p.name}
          name={p.name}
          coverImage={p.coverImage}
          repo={p.repo}
          url={p.url}
          index={i}
          totalItems={projects.length}
          scrollTimelineName="projectCarousel"
        />
      ))}
    </Carousel>
  );
};

export default ProjectsList;
