import { ArrowUpRight, Github } from 'lucide-react';

import RepoList from '@/components/GitHub/repo-list.json';

export function OpenSourceView() {
  return (
    <div className="page-pad">
      <p className="eyebrow" style={{ marginBottom: 10 }}>
        Open Source
      </p>
      <h1 className="page-title" style={{ marginBottom: 32 }}>
        OSS <em>contributions.</em>
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {RepoList.map((repo) => (
          <div
            key={repo.title}
            style={{
              padding: '16px 18px',
              borderRadius: 10,
              background: 'var(--color-bg-panel)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
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
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                  marginBottom: 4,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {repo.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--color-ink-3)',
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                {repo.description}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {repo.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '2px 7px',
                      borderRadius: 100,
                      background: 'var(--color-bg)',
                      color: 'var(--color-ink-3)',
                      border: '1px solid var(--color-border)',
                      lineHeight: 1,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <a
                href={repo.url}
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
                className="hover:text-[var(--color-accent-text)]"
                title="View on GitHub"
              >
                <Github size={14} aria-hidden="true" />
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
