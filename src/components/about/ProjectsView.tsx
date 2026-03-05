import { ArrowUpRight, Github } from 'lucide-react';

import {
  MessyCarousel,
  MessyCarouselItem,
} from '@/components/about/MessyCarousel';
import { Card } from '@/components/common/Card';
import { Chip } from '@/components/common/Chip';
import { PageHeader } from '@/components/common/PageHeader';
import RepoList from '@/components/GitHub/repo-list.json';
import { projects } from '@/constants/projects';

export function ProjectsView() {
  return (
    <div className="page-pad">
      <PageHeader
        eyebrow="Projects"
        title={
          <>
            Things I&apos;ve <em>built.</em>
          </>
        }
      />

      <MessyCarousel>
        {projects.map((project, i) => (
          <MessyCarouselItem key={project.name} index={i} className="w-[260px]">
            <Card hover className="overflow-hidden">
              <div className="h-[140px] bg-(--color-bg-hover) overflow-hidden">
                <img
                  src={project.coverImage}
                  alt={project.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="px-[14px] py-[12px] flex flex-col flex-1">
                <div className="text-[14px] font-semibold text-(--color-ink) mb-1 leading-snug">
                  {project.name}
                </div>
                <div className="text-[12px] text-(--color-ink-3) leading-[1.4] mb-[10px]">
                  {project.description}
                </div>
                <div className="flex gap-2 mt-auto">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] text-(--color-accent-text) no-underline font-medium hover:underline"
                  >
                    <ArrowUpRight size={12} aria-hidden="true" />
                    Visit
                  </a>
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] text-(--color-ink-4) no-underline font-medium hover:text-(--color-ink)"
                    >
                      <Github size={12} aria-hidden="true" />
                      Source
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </MessyCarouselItem>
        ))}
      </MessyCarousel>

      {/* OSS */}
      <div className="flex flex-col gap-3">
        {RepoList.map((repo) => (
          <Card
            key={repo.title}
            hover
            className="flex items-start justify-between gap-4 px-[18px] py-4"
          >
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-(--color-ink) mb-1 font-mono">
                {repo.title}
              </div>
              <div className="text-[13px] text-(--color-ink-3) leading-[1.5] mb-[10px]">
                {repo.description}
              </div>
              <div className="flex flex-wrap gap-[5px]">
                {repo.tags.map((tag) => (
                  <Chip key={tag} size="xs" variant="muted">
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>

            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] text-(--color-ink-4) no-underline font-medium hover:text-(--color-accent-text) shrink-0"
              title="View on GitHub"
            >
              <Github size={14} aria-hidden="true" />
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
