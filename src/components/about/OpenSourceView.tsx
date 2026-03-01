import { ArrowUpRight, Github } from 'lucide-react';

import { Card } from '@/components/common/Card';
import { Chip } from '@/components/common/Chip';
import { PageHeader } from '@/components/common/PageHeader';
import RepoList from '@/components/GitHub/repo-list.json';

export function OpenSourceView() {
  return (
    <div className="page-pad">
      <PageHeader
        eyebrow="Open Source"
        title={
          <>
            OSS <em>contributions.</em>
          </>
        }
      />

      <div className="flex flex-col gap-3">
        {RepoList.map((repo) => (
          <Card
            key={repo.title}
            hover
            className="flex items-start justify-between gap-4 px-[18px] py-4"
          >
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-[var(--color-ink)] mb-1 font-mono">
                {repo.title}
              </div>
              <div className="text-[13px] text-[var(--color-ink-3)] leading-[1.5] mb-[10px]">
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

            <div className="flex gap-2 shrink-0">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] text-[var(--color-ink-4)] no-underline font-medium hover:text-[var(--color-accent-text)]"
                title="View on GitHub"
              >
                <Github size={14} aria-hidden="true" />
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
