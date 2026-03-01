import { Chip } from '@/components/common/Chip';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionLabel } from '@/components/common/SectionLabel';

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

export function StackView() {
  return (
    <div className="page-pad">
      <PageHeader
        eyebrow="Stack"
        title={
          <>
            Tools of the <em>trade.</em>
          </>
        }
      />

      <div className="flex flex-col gap-7">
        {STACK.map((group) => (
          <div key={group.label}>
            <SectionLabel className="mb-[10px]">{group.label}</SectionLabel>
            <div className="flex flex-wrap gap-[7px]">
              {group.items.map((item) => (
                <Chip key={item} size="md">
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
