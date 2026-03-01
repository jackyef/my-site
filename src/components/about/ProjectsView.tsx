import { ArrowUpRight, Github } from 'lucide-react';

import { projects } from '@/components/Projects/projects';

export function ProjectsView() {
  return (
    <div className="page-pad">
      <p className="eyebrow" style={{ marginBottom: 10 }}>
        Projects
      </p>
      <h1 className="page-title" style={{ marginBottom: 32 }}>
        Things I&apos;ve <em>built.</em>
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
        }}
      >
        {projects.map((project) => (
          <div
            key={project.name}
            style={{
              borderRadius: 10,
              background: 'var(--color-bg-panel)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              transition:
                'transform 0.2s, box-shadow 0.2s, background-color 0.22s, border-color 0.22s',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                'translateY(-1px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = '';
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                'var(--shadow-sm)';
            }}
          >
            {/* Cover image */}
            <div
              style={{
                height: 120,
                background: 'var(--color-bg-hover)',
                overflow: 'hidden',
              }}
            >
              <img
                src={project.coverImage}
                alt={project.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div style={{ padding: '12px 14px' }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                  marginBottom: 10,
                }}
              >
                {project.name}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    color: 'var(--color-accent-text)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                  className="hover:underline"
                >
                  <ArrowUpRight size={12} aria-hidden="true" />
                  Visit
                </a>
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: 'var(--color-ink-4)',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                    className="hover:text-[var(--color-ink)]"
                  >
                    <Github size={12} aria-hidden="true" />
                    Source
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
