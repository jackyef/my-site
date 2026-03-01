import { ArrowUpRight, Github } from 'lucide-react';

import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { projects } from '@/components/Projects/projects';

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

      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        {projects.map((project) => (
          <Card key={project.name} hover className="overflow-hidden">
            {/* Cover image */}
            <div className="h-[120px] bg-[var(--color-bg-hover)] overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="px-[14px] py-[12px]">
              <div className="text-[14px] font-semibold text-[var(--color-ink)] mb-[10px]">
                {project.name}
              </div>
              <div className="flex gap-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] text-[var(--color-accent-text)] no-underline font-medium hover:underline"
                >
                  <ArrowUpRight size={12} aria-hidden="true" />
                  Visit
                </a>
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] text-[var(--color-ink-4)] no-underline font-medium hover:text-[var(--color-ink)]"
                  >
                    <Github size={12} aria-hidden="true" />
                    Source
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
