import React, { useState } from 'react';

import { ChessComTimeControl } from 'types/chesscom';
import { ChessComTimeControlIcon } from '@/components/ChessComStats/ChessComTimeCategoryIcon';
import { useMatchesSummary } from '@/components/ChessComStats/hooks/useMatchesSummary';
import { useStats } from '@/components/ChessComStats/hooks/useStats';
import { AnimatedNumber } from '@/components/common/AnimatedNumber';
import { Card } from '@/components/common/Card';
import { SectionLabel } from '@/components/common/SectionLabel';
import {
  SegmentedControl,
  SegmentOption,
} from '@/components/common/SegmentedControl';
import { StatusDot } from '@/components/common/StatusDot';
import { TypewriterText } from '@/components/common/TypewriterText';
import { IOWrapper } from '@/components/IntersectionObserver/Wrapper';

import { SOCIALS } from '@/constants/socials';
import { cn } from '@/utils/styles/classNames';

interface WidgetProps {
  label: string;
  children: React.ReactNode;
  span?: 1 | 2 | 3;
  mobileFullWidth?: boolean;
}

function Widget({ label, children, span = 1, mobileFullWidth }: WidgetProps) {
  const gridClass = cn(
    span === 3 ? 'widget-full' : '',
    mobileFullWidth ? 'widget-mobile-full' : '',
    span === 2 && !mobileFullWidth ? 'col-span-2' : '',
  );

  return (
    <Card hover className={cn('px-[16px] py-[14px] cursor-default', gridClass)}>
      <SectionLabel className="mb-2">{label}</SectionLabel>
      {children}
    </Card>
  );
}

function WidgetValue({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-serif text-[20px] font-semibold text-(--color-ink) leading-[1.2] mb-[3px]">
      {children}
    </div>
  );
}

function WidgetSub({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('text-[13px] text-(--color-ink-3)', className)}>
      {children}
    </div>
  );
}

const NOW_ITEMS = [
  { emoji: '♟️', text: 'Chasing 2,000 rating' },
  { emoji: '🦵', text: 'Recovering from knee injury' },
  { emoji: '🏀', text: 'Working on jump shots and getting crafty' },
  { emoji: '💭', text: 'Contemplating getting a Steam Deck' },
  { emoji: '🧪', text: 'Experimenting with AI-assisted workflows' },
];

function NowWidget() {
  return (
    <Widget label="Now" span={2}>
      <ul className="space-y-2 mt-1">
        {NOW_ITEMS.map((item) => (
          <li
            key={item.text}
            className="flex items-start gap-2 text-[14px] text-(--color-ink-2)"
          >
            <span className="text-[16px] leading-[1.4] shrink-0">
              {item.emoji}
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </Widget>
  );
}

function ChessWidgetSkeleton() {
  return (
    <Card hover className="px-[16px] py-[14px] cursor-default">
      <SectionLabel className="mb-2">Chess.com</SectionLabel>
      <div className="min-h-[180px] flex items-center justify-center">
        <span className="text-[13px] text-(--color-ink-4)">Loading…</span>
      </div>
    </Card>
  );
}

export type BlogStats = {
  postCount: number;
};

function AboutWidget({ blogStats }: { blogStats: BlogStats }) {
  return (
    <Card
      hover
      className="px-[16px] py-[14px] cursor-default widget-mobile-full md:row-span-2 self-start"
    >
      <SectionLabel className="mb-3">Writing</SectionLabel>
      <div className="font-serif text-[56px] font-bold text-(--color-ink) leading-none">
        {blogStats.postCount}
      </div>
      <div className="text-[13px] text-(--color-ink-3) mt-1">
        writings total
      </div>
      <a
        href="/blog"
        className="inline-block mt-2 text-[13px] text-(--color-accent-text) no-underline hover:underline"
      >
        Read the blog →
      </a>

      <hr className="border-(--color-border) my-4" />

      <SectionLabel className="mb-2.5">Connect</SectionLabel>
      <ul className="space-y-2.5">
        {SOCIALS.map(({ href, label, icon }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[14px] text-(--color-ink-2) hover:text-(--color-accent-text) transition-colors"
            >
              <span className="text-(--color-ink-4) transform -translate-y-0.5">
                {icon}
              </span>
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const CHESS_USER_ID = '344047395';
const CHESS_USERNAME = 'PixelParser';
const TIME_CONTROLS: ChessComTimeControl[] = ['rapid', 'blitz', 'bullet'];

const TC_OPTIONS: SegmentOption<ChessComTimeControl>[] = TIME_CONTROLS.map(
  (control) => ({
    value: control,
    icon: <ChessComTimeControlIcon timeControl={control} />,
    title: control,
  }),
);

function ChessBoardDeco() {
  const cells = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if ((row + col) % 2 === 0) {
        cells.push(
          <rect
            key={`${row}-${col}`}
            x={col * 14}
            y={row * 14}
            width={14}
            height={14}
            rx={2}
          />,
        );
      }
    }
  }
  return (
    <svg
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="currentColor"
      className="text-(--color-ink)"
    >
      {cells}
    </svg>
  );
}

function WLDBar({ w, d, l }: { w: number; d: number; l: number }) {
  const total = w + d + l;

  return (
    <div className="mt-3">
      <div className="flex rounded-full overflow-hidden h-[6px] mb-[6px]">
        {total > 0 ? (
          <>
            <div
              className="bg-(--color-success) rounded-l-full"
              style={{ flex: w }}
            />
            <div className="bg-(--color-ink-4) mx-[1px]" style={{ flex: d }} />
            <div className="bg-[#e05a5a] rounded-r-full" style={{ flex: l }} />
          </>
        ) : (
          <div className="bg-(--color-border) w-full rounded-full" />
        )}
      </div>
      <div className="flex justify-between text-[12px] font-medium">
        <span className="text-(--color-success)">
          {total > 0 ? `${w}W` : '\u00A0'}
        </span>
        <span className="text-(--color-ink-4)">
          {total > 0 ? `${d}D` : '\u00A0'}
        </span>
        <span className="text-[#e05a5a]">{total > 0 ? `${l}L` : '\u00A0'}</span>
      </div>
    </div>
  );
}

function ChessWidget() {
  const [tc, setTc] = useState<ChessComTimeControl>('bullet');

  const { stats, matches } = useStats({
    userId: CHESS_USER_ID,
    timeControl: tc,
  });
  const matchesSummary = useMatchesSummary({
    matches,
    username: CHESS_USERNAME,
  });

  const allTimeWins = stats ? stats.white_win_count + stats.black_win_count : 0;
  const allTimeDraws = stats
    ? stats.white_draw_count + stats.black_draw_count
    : 0;
  const allTimeLosses = stats
    ? stats.white_loss_count + stats.black_loss_count
    : 0;

  const streakEmoji =
    matchesSummary?.lastResult === 'wins'
      ? '🔥'
      : matchesSummary?.lastResult === 'losses'
        ? '🥶'
        : '↔️';

  const streakLabel = matchesSummary
    ? `${
        matchesSummary.lastResult === 'wins'
          ? 'win'
          : matchesSummary.lastResult === 'losses'
            ? 'loss'
            : 'draw'
      } streak`
    : '';

  return (
    <Widget label="Chess.com">
      <div className="relative min-h-[180px]">
        {/* Decorative chess board pattern */}
        <div
          className="absolute top-[-4px] right-0 opacity-[0.05] pointer-events-none"
          aria-hidden="true"
        >
          <ChessBoardDeco />
        </div>

        {/* Time control picker */}
        <SegmentedControl
          options={TC_OPTIONS}
          value={tc}
          onChange={setTc}
          className="w-fit"
        />

        {/* Rating hero */}
        <div className="mt-4">
          <div
            className={cn(
              'font-serif text-[42px] font-bold text-(--color-ink) leading-none transition-opacity duration-300',
              stats ? 'opacity-100' : 'opacity-30',
            )}
          >
            <AnimatedNumber value={stats?.rating_last} />
          </div>
          <div className="text-[13px] text-(--color-ink-3) mt-1">
            {stats ? `Peak ${stats.rating_max}` : '\u00A0'}
          </div>
        </div>

        {/* Username */}
        <a
          href="https://chess.com/member/pixelparser"
          target="_blank"
          rel="noopener noreferrer"
          className="text-(--color-accent-text) font-serif text-[14px] font-semibold no-underline inline-block mt-0.5"
        >
          PixelParser ↗
        </a>

        {/* WLD proportional bar */}
        <div
          className={cn(
            'transition-opacity duration-300',
            stats ? 'opacity-100' : 'opacity-0',
          )}
        >
          <WLDBar w={allTimeWins} d={allTimeDraws} l={allTimeLosses} />
        </div>

        {/* Recent + Streak */}
        <div
          className={cn(
            'flex items-center justify-between mt-2 text-[12px] text-(--color-ink-3) transition-opacity duration-300',
            stats ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span>
            {matchesSummary
              ? `Last ${matchesSummary.totalMatches}: ${matchesSummary.wins}W ${matchesSummary.draws}D ${matchesSummary.losses}L`
              : '\u00A0'}
          </span>
          <span>
            {matchesSummary
              ? `${streakEmoji} ${matchesSummary.streakCount} ${streakLabel}`
              : ''}
          </span>
        </div>
      </div>
    </Widget>
  );
}

export function WidgetGrid({ blogStats }: { blogStats: BlogStats }) {
  return (
    <div className="widget-grid">
      {/* Row 1: Currently (col 1-2) + Based in (col 3) */}
      <Widget label="Currently" span={2}>
        <WidgetValue>Senior Software Engineer at Sticker Mule</WidgetValue>
        <div className="flex items-center gap-1 mt-1.5">
          <StatusDot className="-translate-0.5" pulse />
          <span className="text-[14px] text-(--color-ink-2)">
            <TypewriterText text="Migrating 7-year-old design system..." />
          </span>
        </div>
      </Widget>

      <Widget label="Based in" mobileFullWidth>
        <div className="flex items-center gap-2.5 mt-1">
          <span className="text-[28px]">🇮🇩</span>
          <div>
            <WidgetValue>
              <span className="text-[17px]">Jakarta</span>
            </WidgetValue>
            <WidgetSub>Indonesia · UTC+7</WidgetSub>
          </div>
        </div>
      </Widget>

      {/* Row 2-3: Now + Chess (col 1-2), About (col 3, row-span-2) */}
      <NowWidget />
      <AboutWidget blogStats={blogStats} />

      <div className="col-span-2">
        <IOWrapper>
          {(show) => (show ? <ChessWidget /> : <ChessWidgetSkeleton />)}
        </IOWrapper>
      </div>
    </div>
  );
}
