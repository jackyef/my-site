import { useState } from 'react';
import {
  CalendarDays,
  Github,
  Layers,
  MessageCircle,
  Rocket,
} from 'lucide-react';

import { BioView } from '@/components/about/BioView';
import { CareerView } from '@/components/about/CareerView';
import { OpenSourceView } from '@/components/about/OpenSourceView';
import { ProjectsView } from '@/components/about/ProjectsView';
import { StackView } from '@/components/about/StackView';
import { SectionTabs, Tab } from '@/components/layout/SectionTabs';
import { PageMetaTags } from '@/components/Seo/PageMetaTags';

const TABS: Tab[] = [
  {
    id: 'bio',
    label: 'Bio',
    icon: <MessageCircle size={14} aria-hidden="true" />,
  },
  {
    id: 'career',
    label: 'Career',
    icon: <CalendarDays size={14} aria-hidden="true" />,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <Rocket size={14} aria-hidden="true" />,
  },
  {
    id: 'oss',
    label: 'Open Source',
    icon: <Github size={14} aria-hidden="true" />,
  },
  {
    id: 'stack',
    label: 'Stack',
    icon: <Layers size={14} aria-hidden="true" />,
  },
];

export default function About() {
  const [activeTab, setActiveTab] = useState('bio');

  return (
    <>
      <PageMetaTags title="About" />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <SectionTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'bio' && <BioView />}
          {activeTab === 'career' && <CareerView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'oss' && <OpenSourceView />}
          {activeTab === 'stack' && <StackView />}
        </div>
      </div>
    </>
  );
}
