interface StackGroup {
  label: string;
  items: string[];
}

const STACK: StackGroup[] = [
  {
    label: 'Primary languages',
    items: ['TypeScript', 'JavaScript', 'Rust', 'HTML & CSS'],
  },
  {
    label: 'Frameworks & libraries',
    items: ['React', 'Next.js', 'Node.js', 'GraphQL', 'Apollo'],
  },
  {
    label: 'Infrastructure & tools',
    items: [
      'Docker',
      'GitHub Actions',
      'Vercel',
      'Webpack',
      'Vite',
      'WebAssembly',
    ],
  },
  {
    label: 'Testing',
    items: ['Jest', 'Playwright', 'Testing Library', 'Storybook'],
  },
  {
    label: 'Performance & monitoring',
    items: [
      'Web Vitals',
      'Lighthouse',
      'Bundle analysis',
      'Source maps',
      'Datadog',
    ],
  },
  {
    label: 'Design tools',
    items: ['Figma', 'Tailwind CSS', 'Framer Motion'],
  },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 13,
        fontWeight: 500,
        padding: '5px 12px',
        borderRadius: 100,
        background: 'var(--color-bg-panel)',
        color: 'var(--color-ink-2)',
        border: '1px solid var(--color-border)',
        lineHeight: 1,
        display: 'inline-block',
        transition: 'background-color 0.22s, border-color 0.22s',
      }}
    >
      {children}
    </span>
  );
}

export function StackView() {
  return (
    <div className="page-pad">
      <p className="eyebrow" style={{ marginBottom: 10 }}>
        Stack
      </p>
      <h1 className="page-title" style={{ marginBottom: 32 }}>
        Tools of the <em>trade.</em>
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {STACK.map((group) => (
          <div key={group.label}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-4)',
                marginBottom: 10,
              }}
            >
              {group.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {group.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
