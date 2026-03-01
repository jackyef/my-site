import { animate } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { ChessComTimeControl } from 'types/chesscom';
import { ChessComTimeControlIcon } from '@/components/ChessComStats/ChessComTimeCategoryIcon';
import { useMatchesSummary } from '@/components/ChessComStats/hooks/useMatchesSummary';
import { useStats } from '@/components/ChessComStats/hooks/useStats';
import { Card } from '@/components/common/Card';
import { Chip } from '@/components/common/Chip';
import { SectionLabel } from '@/components/common/SectionLabel';
import {
  SegmentedControl,
  SegmentOption,
} from '@/components/common/SegmentedControl';
import { StatusDot } from '@/components/common/StatusDot';

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
    <div className="font-serif text-[20px] font-semibold text-[var(--color-ink)] leading-[1.2] mb-[3px]">
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
    <div className={cn('text-[13px] text-[var(--color-ink-3)]', className)}>
      {children}
    </div>
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

function WLD({
  w,
  d,
  l,
  label,
}: {
  w: number;
  d: number;
  l: number;
  label: string;
}) {
  return (
    <div className="mb-[6px]">
      <div className="text-[11px] text-[var(--color-ink-4)] mb-[3px] uppercase tracking-[0.06em]">
        {label}
      </div>
      <div className="flex gap-[10px] text-[13px] font-semibold">
        <span style={{ color: 'var(--color-success)' }}>W {w}</span>
        <span className="text-[var(--color-ink-3)]">D {d}</span>
        <span style={{ color: '#e05a5a' }}>L {l}</span>
      </div>
    </div>
  );
}

function ChessWidget() {
  const [tc, setTc] = useState<ChessComTimeControl>('rapid');
  const ratingRef = useRef<HTMLSpanElement>(null);

  const { stats, matches } = useStats({
    userId: CHESS_USER_ID,
    timeControl: tc,
  });
  const matchesSummary = useMatchesSummary({
    matches,
    username: CHESS_USERNAME,
  });

  useEffect(() => {
    if (!stats || !ratingRef.current) return;
    const node = ratingRef.current;
    const controls = animate(0, stats.rating_last, {
      duration: 1,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => {
        node.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [stats?.rating_last, tc]);

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
  const streakEmojis = matchesSummary
    ? Array.from({
        length: Math.min(Math.ceil(matchesSummary.streakCount / 3), 3),
      })
        .fill(streakEmoji)
        .join('')
    : '';

  return (
    <Widget label="Chess.com" span={3}>
      <div className="flex gap-8 flex-wrap">
        {/* Left: identity + time picker + rating */}
        <div className="min-w-[140px]">
          <div className="flex items-center gap-[10px] mb-3">
            <a
              href="https://chess.com/member/pixelparser"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent-text)] font-serif text-[15px] font-semibold no-underline"
            >
              PixelParser ↗
            </a>
            <SegmentedControl
              options={TC_OPTIONS}
              value={tc}
              onChange={setTc}
            />
          </div>

          {/* Animated rating */}
          <div className="font-serif text-[36px] font-bold text-[var(--color-ink)] leading-none mb-[2px]">
            <span ref={ratingRef}>—</span>
          </div>
          <WidgetSub>
            {tc} rating
            {stats ? ` · ${stats.rating_max} peak` : ''}
          </WidgetSub>
        </div>

        {/* Right: records + streak */}
        {stats && (
          <div className="flex flex-col justify-center">
            <WLD
              label="All-time"
              w={allTimeWins}
              d={allTimeDraws}
              l={allTimeLosses}
            />
            {matchesSummary && (
              <WLD
                label={`Last ${matchesSummary.totalMatches}`}
                w={matchesSummary.wins}
                d={matchesSummary.draws}
                l={matchesSummary.losses}
              />
            )}
            {matchesSummary && (
              <WidgetSub className="mt-1">
                {matchesSummary.streakCount} {matchesSummary.lastResult} in a
                row {streakEmojis}
              </WidgetSub>
            )}
          </div>
        )}
      </div>
    </Widget>
  );
}

export function WidgetGrid() {
  return (
    <div className="widget-grid">
      {/* Currently */}
      <Widget label="Currently" span={2}>
        <WidgetValue>Tech Lead at Sticker Mule</WidgetValue>
        <div className="flex items-center gap-2 mt-[6px]">
          <StatusDot />
          <span className="text-[14px] text-[var(--color-ink-2)] font-medium">
            Open to interesting remote opportunities
          </span>
        </div>
      </Widget>

      {/* Based in */}
      <Widget label="Based in" mobileFullWidth>
        <div className="flex items-center gap-[10px] mt-1">
          <span className="text-[28px]">🇮🇩</span>
          <div>
            <WidgetValue>
              <span className="text-[17px]">Jakarta</span>
            </WidgetValue>
            <WidgetSub>Indonesia · UTC+7</WidgetSub>
          </div>
        </div>
      </Widget>

      {/* Day-to-day stack */}
      <Widget label="Day-to-day stack" span={3}>
        <div className="flex flex-wrap gap-[5px] mt-2">
          {[
            { name: 'React', hi: true },
            { name: 'TypeScript', hi: true },
            { name: 'Next.js', hi: true },
            { name: 'Node.js', hi: false },
            { name: 'GraphQL', hi: false },
            { name: 'Apollo', hi: false },
            { name: 'Docker', hi: false },
            { name: 'WebAssembly', hi: false },
            { name: 'Rust', hi: false },
            { name: 'Web Perf', hi: true },
            { name: 'Frontend Infra', hi: true },
          ].map(({ name, hi }) => (
            <Chip key={name} variant={hi ? 'highlight' : 'muted'} size="sm">
              {name}
            </Chip>
          ))}
        </div>
      </Widget>

      {/* Experience */}
      <Widget label="Experience">
        <WidgetValue>7+ years</WidgetValue>
        <WidgetSub>Tokopedia → Sticker Mule</WidgetSub>
      </Widget>

      {/* Talks given */}
      <Widget label="Talks given">
        <WidgetValue>5+</WidgetValue>
        <WidgetSub>Conferences & meetups</WidgetSub>
      </Widget>

      {/* Chess.com */}
      <ChessWidget />
    </div>
  );
}
