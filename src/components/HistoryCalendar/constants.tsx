import { TODAY } from '@/lib/datetime';

import type { BaseEvent } from '../Timeline/TimelineEvent';
import { TechnologyAnchors } from '../TechnologyAnchors';

import { ExternalMedia, ExternalMediaList } from './components/ExternalMedia';
import { UnorderedList } from './components/UnorderedList';

export const TIMELINE_START = new Date('2017-01-01');

export type JobHistoryEvent = BaseEvent & {
  details?: React.ReactNode;
};

export const timelineEvents = [
  {
    from: new Date('2020-12-05'),
    to: TODAY,
    title: 'Senior Software Engineer',
    description: 'Sticker Mule',
    variant: 'amber',
    details: (
      <>
        <p>
          I am currently working at the Platform UX team at Sticker Mule. Our
          primary responsibility revolves around maintaining shared libraries
          used to build various products and infrastructure in our monorepo.
        </p>
        <p>
          We are also responsible for the main e-commerce platform, which
          includes everything from products, catalogs, all the way to checkout!
        </p>
        <p>
          Due to the team scattered around the globe, our collaboration style is
          very much asynchronous.
        </p>
        <p>
          If you are looking for specifics, I play around with{' '}
          <TechnologyAnchors /> on a daily basis.
        </p>
      </>
    ),
  },
  {
    from: new Date('2020-11-01'),
    to: new Date('2020-11-30'),
    title: 'Taking a break 🛏',
    description: 'Unemployed',
    variant: 'blue',
    details: (
      <>
        <p>
          I resigned from Tokopedia. It was a scary leap-of-faith, but I am glad
          I made it!
        </p>
        <p>
          I gave myself a one-month gap so I could prepare myself and get some
          rest before starting the next chapter.
        </p>
      </>
    ),
  },
  {
    from: new Date('2020-01-01'),
    to: new Date('2020-10-28'),
    title: 'Principal Engineer - Web Platform',
    description: 'Tokopedia',
    variant: 'green',
    details: (
      <>
        <p>I got promoted! 🎉</p>
        <p>
          I still worked in the core team, and had more responsibilities
          including but not limited to, planning and implementing various tech
          improvements along with the team.
        </p>
        <p>Some projects that I worked on:</p>
        <UnorderedList>
          <li>
            Migrated our frontend monorepo from Yarn workspace to pnpm. Reduced
            the amount of errors caused by faulty dependency resolutions.
          </li>
          <li>
            Pioneered the use of Next.js + Preact for microsites, setting up the
            generator and integrating with existing pipelines. Reduced the
            amount of bytes sent over the wire for microsites.
          </li>
          <li>
            Improved loading performance of Tokopedia svelte-based mobile home
            page. Reduced Largest Contentful Paint (LCP) timing from 4.1s to
            1.7s
          </li>
          <li>
            Improved the build time of staging builds by 90% to enable faster
            development workflows
          </li>
        </UnorderedList>

        <p>
          I also had more responsibilities to give talks and share knowledge,
          both internally and externally. In 2020, along with a bunch of
          internal talks (sharing session with other engineers), I gave 2 talks
          at Tokopedia START Summit 2020 and Google&apos;s web.dev ID partners
          forum.
        </p>

        <ExternalMediaList>
          <ExternalMedia
            title="Getting Content Painted under 2 seconds on the Mobile Web"
            href="https://medium.com/tokopedia-engineering/getting-content-painted-under-2-seconds-on-the-mobile-web-7b3bbaca32cb?source=---------2----------------------------"
            imgSrc="https://miro.medium.com/max/600/1*dt64F0e6meLcS7WOKS7lsA.jpeg?q=75"
          />
          <ExternalMedia
            title="The Case for pnpm Over npm or Yarn"
            href="https://medium.com/better-programming/the-case-for-pnpm-over-npm-or-yarn-2b221607119?source=---------4----------------------------"
            imgSrc="https://miro.medium.com/max/600/1*_ZwobpKb_RVWMkt38Dl3bg.png?q=75"
          />
        </ExternalMediaList>
      </>
    ),
  },
  {
    from: new Date('2019-07-01'),
    to: new Date('2019-12-31'),
    title: 'Senior Software Engineer - Web Platform',
    description: 'Tokopedia',
    variant: 'fuchsia',
    details: (
      <>
        <p>
          As of this day, I was no longer part of the Mobile Web team, but
          rather the Web Platform team. This was not a promotion, rather a
          lateral move as a result of the team growing and organizational change
          that happened during this period.
        </p>
        <p>
          The Mobile Web team grew into the Web Platform team, receiving more
          responsibility and ownership over the web platform frontend as a whole
          at Tokopedia. The frontend tech-stack was not at all unified, and
          unifying them was one of the Wen Platform team&apos;s main goals.
        </p>
        <p>
          During these early days, we focused on onboarding new members who
          previously worked full-stack but wanted to specialize in the web
          frontend. We hosted a series of workshops and sharing sessions, while
          also improving the developer tools, build pipelines and infrastructure
          to make developers&apos; life easier.
        </p>

        <p>
          For the most part, my responsibility shifted from building features to
          building tools and infrastructure. You could say I moved from
          frontend-product to frontend-infra. I had been handling frontend-infra
          for a while now at this point, but this move made it official.
        </p>

        <ExternalMediaList>
          <ExternalMedia
            title="Building 60 FPS QR Scanner for the Mobile Web"
            href="https://medium.com/tokopedia-engineering/building-60-fps-qr-scanner-for-the-mobile-web-eb0deddce099?source=---------5----------------------------"
            imgSrc="https://miro.medium.com/max/600/1*o-1FRXCv8hwsN5IMYRxo3Q.jpeg?q=75"
          />
        </ExternalMediaList>
      </>
    ),
  },
  {
    from: new Date('2019-01-01'),
    to: new Date('2019-06-30'),
    title: 'Senior Software Engineer - Mobile Web',
    description: 'Tokopedia',
    variant: 'fuchsia',
    details: (
      <>
        <p>I got promoted! 🎉</p>
        <p>
          Thinking back, I was really happy when this happened, as it is an
          affirmation that I was on the right track. I finally reached a level
          of independence to take care of my own work, while also be capable
          enough to help others.
        </p>
        <p>
          Nothing much changed compared to the later days of my previous
          position. But I did have more emphasis on sharing, mentoring,
          researching, and overall owning more responsibilities.
        </p>

        <p>Some notable differences:</p>
        <UnorderedList>
          <li>
            Now working on the web platform as a whole instead of just the
            mobile web platform
          </li>
          <li>
            Help developing the in-house development tools to help other
            engineers work more effectively{' '}
          </li>
          <li>Take part in discussions on design and planning decisions</li>
        </UnorderedList>

        <ExternalMediaList>
          <ExternalMedia
            title="Achieving 90+ Mobile Web Performance at Tokopedia"
            href="https://medium.com/tokopedia-engineering/achieving-90-mobile-web-performance-at-tokopedia-23f557d98d5?source=---------7------------------"
            imgSrc="https://miro.medium.com/max/600/1*iutJ4V6Jl9CmLMy5zFcoAA.jpeg?q=75"
          />
        </ExternalMediaList>
      </>
    ),
  },
  {
    from: new Date('2017-11-05'),
    to: new Date('2018-12-31'),
    title: 'Software Engineer - Mobile Web',
    description: 'Tokopedia',
    variant: 'teal',
    details: (
      <>
        <p>
          I joined Tokopedia as a fresh graduate. It was an exciting yet scary
          experience for me. This was my first real job outside of my hometown.
        </p>
        <p>
          I was assigned to the Mobile Web team, which was responsible for...
          well, the Tokopedia&apos;s mobile web. Just like how the iOS and
          Android team focused on building their app, we focused on building the
          mobile web with React.js. We also pioneered the usage of GraphQL at
          Tokopedia, which we developed on Node.js at the time.
        </p>
        <p>
          I remember I felt very poorly equipped to do my job. I didn&apos;t
          have a great grasp on how the web works. I ended up having to ask lots
          of questions to the more senior members of the team on a daily basis.
          I am very grateful that the team were very patient and helpful which
          helped accelerated my growth.
        </p>
        <p>
          During this period, I helped implementing some products and features
          to the mobile web, including:
        </p>
        <UnorderedList>
          <li>TopChat, a chat platform</li>
          <li>TokoPoints, a loyalty points program</li>
          <li>
            Mitra Tokopedia, a partnership program for small mom-and-pop shops
          </li>
          <li>
            Researching possible improvements in general as we are looking to
            solidify our web platform infrastructure
          </li>
        </UnorderedList>
        <p>
          As time went on, I became more and more comfortable with my work. By
          the end of this period I started to be hold my own and also help other
          with their works.
        </p>
      </>
    ),
  },
  {
    from: new Date('2017-09-01'),
    to: new Date('2017-10-31'),
    title: 'Self-study and preparation 📝',
    description: 'Signed an offer from Tokopedia, started preparation',
    variant: 'red',
    details: (
      <>
        <p>
          I intentionally resigned from my previous job earlier so I could have
          more time to prepare myself for the job at Tokopedia. I had a major
          impostor syndrome, so I felt like I needed to study and learn a lot to
          make sure I could work well when the time comes.
        </p>
        <p>
          I also prepared myself mentally because this was the very first time
          for me to leave my hometown.
        </p>
      </>
    ),
  },
  {
    from: new Date('2017-06-01'),
    to: new Date('2017-08-31'),
    title: 'Programmer',
    description:
      'My very first full-time job at a local company in my hometown',
    variant: 'slate',
    details: (
      <>
        <p>
          This was my very first programming job. I resigned 2 months into the
          3-month probation period because I had an offer from Tokopedia.
        </p>
      </>
    ),
  },
  {
    from: TIMELINE_START,
    to: new Date('2017-05-31'),
    title: '🎓 College Student and 🤓 Part-Time English Teacher',
    description: 'Doing what I can to survive',
    variant: 'violet',
    details: (
      <>
        <p>
          I studied informatics at a polytechnic on most days from 7am to 4pm. I
          took a part-time English teaching job that I could do after
          school-hours, which helped me improve my English while earning some
          money.
        </p>
      </>
    ),
  },
] as const;
