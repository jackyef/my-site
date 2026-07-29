import { ArrowUpRightIcon } from 'lucide-react';

import type { WritingItem } from '@/blog/types';
import { Chip } from '@/components/common/Chip';
import { Heading } from '@/components/common/Heading';
import { Text } from '@/components/common/Text';
import { TextLink } from '@/components/common/TextLink';
import repoList from '@/components/GitHub/repo-list.json';
import { SOCIALS } from '@/constants/socials';
import { projects } from '@/constants/projects';
import { formatPostDate } from '@/lib/datetime';

import { EARLIER_CAREER, EXPERIENCE, RESUME_INTRO, SKILLS } from './data';
import type { SectionId } from './CozyRoom/hotspots';

export const SECTION_TITLES: Record<SectionId, string> = {
  about: 'About me',
  career: 'Career',
  projects: 'Projects',
  writing: 'Selected writing',
  contact: 'Say hello',
};

const externalLinkClass =
  'fancy-link inline-flex items-center gap-1 text-(--color-accent-text)';

export function AboutSection() {
  return (
    <div className="flex flex-col gap-4">
      {RESUME_INTRO.map((paragraph) => (
        <Text key={paragraph.slice(0, 24)} variant="body-sm">
          {paragraph}
        </Text>
      ))}

      <div className="flex flex-wrap gap-1.5 pt-1">
        {SKILLS.map((skill) => (
          <Chip key={skill} size="xs">
            {skill}
          </Chip>
        ))}
      </div>

      <Text variant="caption" className="pt-1">
        The longer version lives on the{' '}
        <TextLink href="/about">about page</TextLink>.
      </Text>
    </div>
  );
}

export function CareerSection() {
  return (
    <div className="flex flex-col gap-6">
      {EXPERIENCE.map((stint) => (
        <div key={stint.company}>
          <div className="flex items-baseline justify-between gap-2">
            <Heading level={4} as="h3">
              {stint.url ? (
                <a
                  href={stint.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-(--color-accent-text) transition-colors"
                >
                  {stint.company}
                </a>
              ) : (
                stint.company
              )}
            </Heading>
            <Text variant="caption-sm" as="span">
              {stint.location}
            </Text>
          </div>

          <div className="mt-3 flex flex-col gap-4">
            {stint.roles.map((role) => (
              <div key={role.title}>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <Text variant="body-sm" color="ink" className="font-semibold">
                    {role.title}
                  </Text>
                  <Text variant="caption-sm" as="span">
                    {role.period}
                  </Text>
                </div>
                <Text variant="body-sm" className="mt-1">
                  {role.summary}
                </Text>
                {role.highlights && (
                  <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
                    {role.highlights.map((highlight) => (
                      <Text key={highlight} variant="caption" as="li">
                        {highlight}
                      </Text>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div>
        <Text variant="caption-sm" className="uppercase tracking-wide">
          Earlier
        </Text>
        <ul className="mt-1 flex flex-col gap-1">
          {EARLIER_CAREER.map((item) => (
            <Text key={item} variant="caption" as="li">
              {item}
            </Text>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <div key={project.name}>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className={externalLinkClass}
            >
              <Text
                variant="body-sm"
                color="ink"
                as="span"
                className="font-semibold"
              >
                {project.name}
              </Text>
              <ArrowUpRightIcon size={14} aria-hidden="true" />
            </a>
            <Text variant="caption" className="mt-0.5">
              {project.description}
            </Text>
          </div>
        ))}
      </div>

      <div>
        <Text variant="caption-sm" className="uppercase tracking-wide">
          Open source
        </Text>
        <div className="mt-2 flex flex-col gap-3">
          {repoList.map((repo) => (
            <div key={repo.title}>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className={externalLinkClass}
              >
                <Text
                  variant="body-sm"
                  color="ink"
                  as="span"
                  className="font-semibold"
                >
                  {repo.title}
                </Text>
                <ArrowUpRightIcon size={14} aria-hidden="true" />
              </a>
              <Text variant="caption" className="mt-0.5">
                {repo.description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WritingSection({ writings }: { writings: WritingItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {writings.map((writing) => (
        <div key={writing.link}>
          <a
            href={writing.link}
            target={writing.isExternal ? '_blank' : undefined}
            rel={writing.isExternal ? 'noreferrer' : undefined}
            className={externalLinkClass}
          >
            <Text
              variant="body-sm"
              color="ink"
              as="span"
              className="font-semibold"
            >
              {writing.title}
            </Text>
            {writing.isExternal && (
              <ArrowUpRightIcon size={14} aria-hidden="true" />
            )}
          </a>
          <Text variant="caption-sm" className="mt-0.5">
            {formatPostDate(writing.date)} · {writing.readingTime}
            {writing.publication ? ` · ${writing.publication}` : ''}
          </Text>
        </div>
      ))}

      <Text variant="caption">
        More on the <TextLink href="/blog">blog</TextLink>.
      </Text>
    </div>
  );
}

export function ContactSection() {
  return (
    <div className="flex flex-col gap-4">
      <Text variant="body-sm">
        The envelope is always on the desk. I enjoy talking about the web,
        performance, developer tooling, and remote work — say hello anywhere
        below.
      </Text>
      <div className="flex flex-wrap gap-2">
        {SOCIALS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target={social.href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-(--color-border-hi) px-3 py-[6px] text-[13px] font-medium text-(--color-ink-2) transition-colors hover:border-(--color-accent) hover:text-(--color-accent-text)"
          >
            {social.icon}
            {social.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function ResumeSectionContent({
  section,
  writings,
}: {
  section: SectionId;
  writings: WritingItem[];
}) {
  switch (section) {
    case 'about':
      return <AboutSection />;
    case 'career':
      return <CareerSection />;
    case 'projects':
      return <ProjectsSection />;
    case 'writing':
      return <WritingSection writings={writings} />;
    case 'contact':
      return <ContactSection />;
  }
}
